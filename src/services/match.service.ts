/**
 * Match Service Layer
 *
 * Abstracts the scoring engine so callers don't import matchingEngine directly.
 * When a GNN model is integrated, only this file needs to change.
 */

import {
  calculateCompatibility,
  getFeatureVector,
  type UserAnswers,
  type BuddyProfile,
  type CompatibilityResult,
  type FeatureVector,
} from '@/utils/matchingEngine';

export type { UserAnswers, BuddyProfile, CompatibilityResult, FeatureVector };

/** Get full match result (score + reasons + confidence) */
export function getMatchScore(user: UserAnswers, buddy: BuddyProfile): CompatibilityResult {
  return calculateCompatibility(user, buddy);
}

/** Get raw feature vector for debugging / future ML pipeline */
export function getFeatures(user: UserAnswers, buddy: BuddyProfile): FeatureVector {
  return getFeatureVector(user, buddy);
}
