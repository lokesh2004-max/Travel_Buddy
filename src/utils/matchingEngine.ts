/**
 * Travel Buddy Compatibility Scoring Engine
 *
 * Deterministic weighted scoring system.
 * Designed to be drop-in replaceable with a Graph ML / GNN model in future.
 *
 * Total possible score: 100
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
  score: number;       // 0–98 (never 100%)
  reasons: string[];   // human-readable match explanations
}

/** Map quiz answer values → buddy interest keywords for interest-intersection scoring */
const STYLE_TO_INTERESTS: Record<string, string[]> = {
  adventure:   ['Hiking', 'Rock Climbing', 'Trekking', 'Camping', 'Mountain Biking', 'Backpacking'],
  culture:     ['Museums', 'Heritage Sites', 'Local Culture', 'Photography', 'Festivals', 'Local Guides'],
  relaxation:  ['Spas', 'Yoga', 'Wellness Retreats', 'Fine Dining', 'Luxury Hotels', 'Meditation'],
  nightlife:   ['Nightlife', 'Beach Parties', 'Festivals', 'Dancing'],
  nature:      ['National Parks', 'Stargazing', 'Camping', 'Rock Climbing', 'Trekking'],
  food:        ['Street Food', 'Food Tours', 'Cooking Classes', 'Local Markets', 'Fine Dining'],
};

const BUDGET_TO_INTERESTS: Record<string, string[]> = {
  budget:      ['Hostels', 'Backpacking', 'Street Food'],
  mid_range:   ['Co-working Spaces', 'Cafes', 'Photography'],
  luxury:      ['Luxury Hotels', 'Business Class', 'Fine Dining', 'Airport Lounges', 'Spas'],
};

const ACCOMMODATION_TO_INTERESTS: Record<string, string[]> = {
  camping:     ['Camping', 'Stargazing', 'National Parks'],
  hostel:      ['Hostels', 'Backpacking', 'Meeting Locals', 'Cultural Exchange'],
  hotel:       ['Fine Dining', 'Luxury Hotels'],
  airbnb:      ['Local Culture', 'Cooking Classes', 'Local Markets'],
};

/**
 * Derive a synthetic BuddyProfile from a buddy's interests array.
 * This bridges the gap between the mock buddy data (which stores interests[])
 * and the quiz answers (which store categorical values).
 */
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
  for (const [acc, keywords] of Object.entries(ACCOMMODATION_TO_INTERESTS)) {
    const count = keywords.filter(k => set.has(k)).length;
    if (count > maxAccCount) { maxAccCount = count; accommodation = acc; }
  }

  return { travel_style, budget, accommodation, interests };
}

/**
 * Core compatibility engine.
 *
 * @param userAnswers - answers collected from the travel quiz
 * @param buddy       - buddy profile (categorical fields + interests array)
 * @returns { score, reasons }
 */
export function calculateCompatibility(
  userAnswers: UserAnswers,
  buddy: BuddyProfile
): CompatibilityResult {
  let score = 0;
  const reasons: string[] = [];

  // ── Travel Style (30pts) ────────────────────────────────────────────────
  if (
    userAnswers.travel_style &&
    buddy.travel_style &&
    userAnswers.travel_style === buddy.travel_style
  ) {
    score += 30;
    reasons.push('You share the same travel style');
  } else if (
    userAnswers.travel_style &&
    buddy.travel_style
  ) {
    // Partial credit for loosely related styles
    const related: Record<string, string[]> = {
      adventure:  ['nature'],
      nature:     ['adventure', 'relaxation'],
      relaxation: ['nature', 'culture'],
      culture:    ['relaxation', 'food'],
      food:       ['culture', 'nightlife'],
      nightlife:  ['food'],
    };
    if (related[userAnswers.travel_style]?.includes(buddy.travel_style)) {
      score += 12;
      reasons.push('Your travel styles are somewhat compatible');
    }
  }

  // ── Budget (20pts) ──────────────────────────────────────────────────────
  if (
    userAnswers.budget &&
    buddy.budget &&
    userAnswers.budget === buddy.budget
  ) {
    score += 20;
    reasons.push('You have similar travel budgets');
  } else if (userAnswers.budget && buddy.budget) {
    const budgetOrder = ['budget', 'mid_range', 'luxury'];
    const diff = Math.abs(
      budgetOrder.indexOf(userAnswers.budget) -
      budgetOrder.indexOf(buddy.budget)
    );
    if (diff === 1) {
      score += 8;
      reasons.push('Your budgets are reasonably close');
    }
  }

  // ── Accommodation (15pts) ───────────────────────────────────────────────
  if (
    userAnswers.accommodation &&
    buddy.accommodation &&
    userAnswers.accommodation === buddy.accommodation
  ) {
    score += 15;
    reasons.push('You prefer the same accommodation type');
  }

  // ── Destination Type (15pts) ────────────────────────────────────────────
  if (
    userAnswers.destination_type &&
    buddy.destination_type &&
    userAnswers.destination_type === buddy.destination_type
  ) {
    score += 15;
    reasons.push('You both enjoy similar destination types');
  }

  // ── Group Size (10pts) ──────────────────────────────────────────────────
  if (
    userAnswers.group_size &&
    buddy.group_size &&
    userAnswers.group_size === buddy.group_size
  ) {
    score += 10;
    reasons.push('You prefer the same travel group size');
  }

  // ── Shared Interests (10pts) ────────────────────────────────────────────
  const userInterests = userAnswers.interests ?? [];
  const buddyInterests = buddy.interests ?? [];

  // Also treat quiz travel_style keywords as implicit interests
  const impliedUserInterests = userAnswers.travel_style
    ? STYLE_TO_INTERESTS[userAnswers.travel_style] ?? []
    : [];
  const impliedBudgetInterests = userAnswers.budget
    ? BUDGET_TO_INTERESTS[userAnswers.budget] ?? []
    : [];

  const allUserInterests = new Set([
    ...userInterests,
    ...impliedUserInterests,
    ...impliedBudgetInterests,
  ]);

  const common = buddyInterests.filter(i => allUserInterests.has(i));
  const interestScore = Math.min(common.length * 3, 10);

  if (interestScore >= 6) {
    score += interestScore;
    reasons.push(`You share ${common.length} travel interests`);
  } else if (interestScore >= 3) {
    score += interestScore;
    reasons.push('You share some travel interests');
  } else if (interestScore > 0) {
    score += interestScore;
  }

  // ── Fallback reason ─────────────────────────────────────────────────────
  if (reasons.length === 0) {
    reasons.push('You could be complementary travel companions');
  }

  // Cap at 98 — never show 100%
  return { score: Math.min(score, 98), reasons };
}
