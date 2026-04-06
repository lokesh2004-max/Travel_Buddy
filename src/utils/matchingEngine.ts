/**
 * Travel Buddy Compatibility Scoring Engine v2
 *
 * Upgraded from rule-based to ML-like soft scoring with:
 * - Similarity matrices instead of strict equality
 * - Jaccard interest similarity
 * - Dynamic weight adjustment
 * - Confidence scoring
 * - GNN-ready feature vector architecture
 *
 * Total base weight: 100
 * ┌─────────────────┬────────┐
 * │ Feature         │ Weight │
 * ├─────────────────┼────────┤
 * │ Travel Style    │  30    │
 * │ Budget          │  20    │
 * │ Accommodation   │  15    │
 * │ Destination Type│  15    │
 * │ Group Size      │  10    │
 * │ Shared Interests│  10    │
 * └─────────────────┴────────┘
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserAnswers {
  travel_style?: string;
  budget?: string;
  accommodation?: string;
  destination_type?: string;
  group_size?: string;
  interests?: string[];
}

export interface BuddyProfile {
  travel_style?: string;
  budget?: string;
  accommodation?: string;
  destination_type?: string;
  group_size?: string;
  interests?: string[];
}

export interface CompatibilityResult {
  score: number;       // 0–98
  reasons: string[];   // human-readable explanations
  confidence: number;  // 0–1, based on data completeness & alignment strength
}

// ─── Similarity Matrices ────────────────────────────────────────────────────

/** Travel style similarity: 1.0 = identical, 0.4–0.6 = related, 0 = unrelated */
const STYLE_SIMILARITY: Record<string, Record<string, number>> = {
  adventure:  { adventure: 1.0, nature: 0.6, culture: 0.2, relaxation: 0.1, food: 0.15, nightlife: 0.2 },
  nature:     { adventure: 0.6, nature: 1.0, relaxation: 0.45, culture: 0.3, food: 0.2, nightlife: 0.05 },
  relaxation: { nature: 0.45, relaxation: 1.0, culture: 0.4, food: 0.35, adventure: 0.1, nightlife: 0.1 },
  culture:    { relaxation: 0.4, culture: 1.0, food: 0.5, nature: 0.3, adventure: 0.2, nightlife: 0.15 },
  food:       { culture: 0.5, food: 1.0, nightlife: 0.35, relaxation: 0.35, nature: 0.2, adventure: 0.15 },
  nightlife:  { food: 0.35, nightlife: 1.0, adventure: 0.2, culture: 0.15, relaxation: 0.1, nature: 0.05 },
};

/** Budget ordered scale for distance scoring */
const BUDGET_LEVELS = ['budget', 'mid_range', 'luxury'] as const;

/** Group size ordered scale */
const GROUP_SIZES = ['solo', 'duo', 'small_group', 'large_group'] as const;

/** Accommodation similarity */
const ACCOMMODATION_SIMILARITY: Record<string, Record<string, number>> = {
  camping: { camping: 1.0, hostel: 0.4, airbnb: 0.2, hotel: 0.05 },
  hostel:  { camping: 0.4, hostel: 1.0, airbnb: 0.5, hotel: 0.2 },
  airbnb:  { camping: 0.2, hostel: 0.5, airbnb: 1.0, hotel: 0.6 },
  hotel:   { camping: 0.05, hostel: 0.2, airbnb: 0.6, hotel: 1.0 },
};

// ─── Interest Inference Maps ────────────────────────────────────────────────

const STYLE_TO_INTERESTS: Record<string, string[]> = {
  adventure:  ['Hiking', 'Rock Climbing', 'Trekking', 'Camping', 'Mountain Biking', 'Backpacking'],
  culture:    ['Museums', 'Heritage Sites', 'Local Culture', 'Photography', 'Festivals', 'Local Guides'],
  relaxation: ['Spas', 'Yoga', 'Wellness Retreats', 'Fine Dining', 'Luxury Hotels', 'Meditation'],
  nightlife:  ['Nightlife', 'Beach Parties', 'Festivals', 'Dancing'],
  nature:     ['National Parks', 'Stargazing', 'Camping', 'Rock Climbing', 'Trekking'],
  food:       ['Street Food', 'Food Tours', 'Cooking Classes', 'Local Markets', 'Fine Dining'],
};

const BUDGET_TO_INTERESTS: Record<string, string[]> = {
  budget:    ['Hostels', 'Backpacking', 'Street Food'],
  mid_range: ['Co-working Spaces', 'Cafes', 'Photography'],
  luxury:    ['Luxury Hotels', 'Business Class', 'Fine Dining', 'Airport Lounges', 'Spas'],
};

// ─── Feature Helpers ────────────────────────────────────────────────────────

function getStyleSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  return STYLE_SIMILARITY[a]?.[b] ?? 0;
}

function getBudgetSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  const idxA = BUDGET_LEVELS.indexOf(a as typeof BUDGET_LEVELS[number]);
  const idxB = BUDGET_LEVELS.indexOf(b as typeof BUDGET_LEVELS[number]);
  if (idxA === -1 || idxB === -1) return 0;
  const distance = Math.abs(idxA - idxB);
  return distance === 1 ? 0.45 : 0;
}

function getAccommodationSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  return ACCOMMODATION_SIMILARITY[a]?.[b] ?? 0;
}

function getGroupSizeSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  const idxA = GROUP_SIZES.indexOf(a as typeof GROUP_SIZES[number]);
  const idxB = GROUP_SIZES.indexOf(b as typeof GROUP_SIZES[number]);
  if (idxA === -1 || idxB === -1) return 0;
  const distance = Math.abs(idxA - idxB);
  if (distance === 1) return 0.5;
  if (distance === 2) return 0.15;
  return 0;
}

/** Jaccard similarity: |A ∩ B| / |A ∪ B| */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Expand user interests with inferred keywords */
function expandInterests(answers: UserAnswers): Set<string> {
  const set = new Set(answers.interests ?? []);
  if (answers.travel_style) {
    for (const kw of STYLE_TO_INTERESTS[answers.travel_style] ?? []) set.add(kw);
  }
  if (answers.budget) {
    for (const kw of BUDGET_TO_INTERESTS[answers.budget] ?? []) set.add(kw);
  }
  return set;
}

// ─── Feature Vector (GNN-Ready) ─────────────────────────────────────────────

export interface FeatureVector {
  styleSim: number;
  budgetSim: number;
  accommodationSim: number;
  destinationMatch: number;
  groupSizeSim: number;
  interestJaccard: number;
  sharedInterestCount: number;
  dataCompleteness: number;
}

export function getFeatureVector(user: UserAnswers, buddy: BuddyProfile): FeatureVector {
  const styleSim = (user.travel_style && buddy.travel_style)
    ? getStyleSimilarity(user.travel_style, buddy.travel_style) : 0;

  const budgetSim = (user.budget && buddy.budget)
    ? getBudgetSimilarity(user.budget, buddy.budget) : 0;

  const accommodationSim = (user.accommodation && buddy.accommodation)
    ? getAccommodationSimilarity(user.accommodation, buddy.accommodation) : 0;

  const destinationMatch = (user.destination_type && buddy.destination_type && user.destination_type === buddy.destination_type)
    ? 1.0 : 0;

  const groupSizeSim = (user.group_size && buddy.group_size)
    ? getGroupSizeSimilarity(user.group_size, buddy.group_size) : 0;

  const userInterests = expandInterests(user);
  const buddyInterests = new Set(buddy.interests ?? []);
  const interestJaccard = jaccardSimilarity(userInterests, buddyInterests);

  let sharedCount = 0;
  for (const item of userInterests) {
    if (buddyInterests.has(item)) sharedCount++;
  }

  // Data completeness: how many fields are populated on both sides
  const fields = ['travel_style', 'budget', 'accommodation', 'destination_type', 'group_size'] as const;
  let populated = 0;
  for (const f of fields) {
    if (user[f] && buddy[f]) populated++;
  }
  const hasInterests = (user.interests?.length ?? 0) > 0 || (buddy.interests?.length ?? 0) > 0;
  const dataCompleteness = (populated + (hasInterests ? 1 : 0)) / 6;

  return {
    styleSim,
    budgetSim,
    accommodationSim,
    destinationMatch,
    groupSizeSim,
    interestJaccard,
    sharedInterestCount: sharedCount,
    dataCompleteness,
  };
}

// ─── Dynamic Weights ────────────────────────────────────────────────────────

interface Weights {
  style: number;
  budget: number;
  accommodation: number;
  destination: number;
  groupSize: number;
  interests: number;
}

function getDynamicWeights(user: UserAnswers): Weights {
  const base: Weights = { style: 30, budget: 20, accommodation: 15, destination: 15, groupSize: 10, interests: 10 };

  // Boost interest weight if user has many interests
  const interestCount = (user.interests?.length ?? 0);
  if (interestCount >= 5) {
    base.interests += 5;
    base.destination -= 3;
    base.groupSize -= 2;
  }

  // If user has no travel style, redistribute
  if (!user.travel_style) {
    base.budget += 10;
    base.interests += 10;
    base.accommodation += 10;
    base.style = 0;
  }

  return base;
}

// ─── Reason Generation ──────────────────────────────────────────────────────

function generateReasons(features: FeatureVector, user: UserAnswers, buddy: BuddyProfile): string[] {
  const reasons: string[] = [];

  if (features.styleSim >= 0.8) {
    reasons.push('Strong alignment in travel style');
  } else if (features.styleSim >= 0.4) {
    reasons.push('Compatible travel personalities');
  }

  if (features.budgetSim >= 0.8) {
    reasons.push('Very similar travel budgets');
  } else if (features.budgetSim >= 0.4) {
    reasons.push('Reasonably compatible budget range');
  }

  if (features.accommodationSim >= 0.8) {
    reasons.push('Same accommodation preferences');
  } else if (features.accommodationSim >= 0.4) {
    reasons.push('Flexible accommodation compatibility');
  }

  if (features.destinationMatch >= 1.0) {
    reasons.push('Both enjoy similar destination types');
  }

  if (features.groupSizeSim >= 0.8) {
    reasons.push('Prefer the same travel group size');
  } else if (features.groupSizeSim >= 0.4) {
    reasons.push('Compatible group size preferences');
  }

  if (features.interestJaccard >= 0.3) {
    reasons.push(`Strong interest overlap (${features.sharedInterestCount} shared)`);
  } else if (features.interestJaccard >= 0.1) {
    reasons.push('Some shared travel interests');
  }

  // Complementary bonus reason
  if (reasons.length >= 3) {
    reasons.unshift('Highly aligned travel companion');
  }

  if (reasons.length === 0) {
    reasons.push('Could be complementary travel companions');
  }

  return reasons;
}

// ─── Core Scoring Engine ────────────────────────────────────────────────────

/**
 * Calculate compatibility score from a feature vector and dynamic weights.
 * Designed to be drop-in replaceable with a trained ML model.
 */
export function calculateScoreFromFeatures(features: FeatureVector, weights: Weights): number {
  const raw =
    features.styleSim * weights.style +
    features.budgetSim * weights.budget +
    features.accommodationSim * weights.accommodation +
    features.destinationMatch * weights.destination +
    features.groupSizeSim * weights.groupSize +
    features.interestJaccard * weights.interests;

  const totalWeight = weights.style + weights.budget + weights.accommodation +
    weights.destination + weights.groupSize + weights.interests;

  // Normalize to 0-100
  let normalized = (raw / totalWeight) * 100;

  // Alignment bonus: reward profiles that score well across multiple dimensions
  const strongDimensions = [
    features.styleSim, features.budgetSim, features.accommodationSim,
    features.destinationMatch, features.groupSizeSim, features.interestJaccard,
  ].filter(v => v >= 0.5).length;

  if (strongDimensions >= 4) normalized += 8;
  else if (strongDimensions >= 3) normalized += 4;

  // Complementary bonus: different styles that pair well
  if (features.styleSim >= 0.3 && features.styleSim < 0.8 && features.interestJaccard >= 0.2) {
    normalized += 3;
  }

  return Math.min(Math.round(normalized), 98);
}

/**
 * Calculate confidence: how much we trust the score based on data quality.
 */
function calculateConfidence(features: FeatureVector): number {
  let confidence = features.dataCompleteness;

  // Higher confidence when more dimensions have data
  const activeDimensions = [
    features.styleSim, features.budgetSim, features.accommodationSim,
    features.destinationMatch, features.groupSizeSim,
  ].filter(v => v > 0).length;

  confidence = confidence * 0.6 + (activeDimensions / 5) * 0.4;

  return Math.round(confidence * 100) / 100; // round to 2 decimals
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Core compatibility engine.
 *
 * @param userAnswers - answers collected from the travel quiz
 * @param buddy       - buddy profile (categorical fields + interests array)
 * @returns { score, reasons, confidence }
 */
export function calculateCompatibility(
  userAnswers: UserAnswers,
  buddy: BuddyProfile,
): CompatibilityResult {
  const features = getFeatureVector(userAnswers, buddy);
  const weights = getDynamicWeights(userAnswers);
  const score = calculateScoreFromFeatures(features, weights);
  const confidence = calculateConfidence(features);
  const reasons = generateReasons(features, userAnswers, buddy);

  return { score, reasons, confidence };
}

// ─── Legacy helper (kept for backward compatibility) ────────────────────────

export function inferBuddyProfile(interests: string[]): BuddyProfile {
  const set = new Set(interests);

  let travel_style: string | undefined;
  let maxStyleCount = 0;
  for (const [style, keywords] of Object.entries(STYLE_TO_INTERESTS)) {
    const count = keywords.filter(k => set.has(k)).length;
    if (count > maxStyleCount) { maxStyleCount = count; travel_style = style; }
  }

  let budget: string | undefined;
  let maxBudgetCount = 0;
  for (const [b, keywords] of Object.entries(BUDGET_TO_INTERESTS)) {
    const count = keywords.filter(k => set.has(k)).length;
    if (count > maxBudgetCount) { maxBudgetCount = count; budget = b; }
  }

  let accommodation: string | undefined;
  let maxAccCount = 0;
  for (const [acc, keywords] of Object.entries(ACCOMMODATION_SIMILARITY)) {
    // Use style inference as fallback since accommodation keywords overlap
    const accInterests: Record<string, string[]> = {
      camping: ['Camping', 'Stargazing', 'National Parks'],
      hostel:  ['Hostels', 'Backpacking', 'Meeting Locals', 'Cultural Exchange'],
      hotel:   ['Fine Dining', 'Luxury Hotels'],
      airbnb:  ['Local Culture', 'Cooking Classes', 'Local Markets'],
    };
    const count = (accInterests[acc] ?? []).filter(k => set.has(k)).length;
    if (count > maxAccCount) { maxAccCount = count; accommodation = acc; }
  }

  return { travel_style, budget, accommodation, interests };
}
