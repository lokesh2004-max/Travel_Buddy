/**
 * GNN-Ready Feature Extraction Layer
 *
 * This module re-exports the feature vector extraction from matchingEngine
 * and provides utilities for future ML model integration.
 */

export { getFeatureVector, type FeatureVector } from '@/utils/matchingEngine';
export type { UserAnswers, BuddyProfile } from '@/utils/matchingEngine';

/**
 * Serialize a feature vector into a flat numeric array
 * suitable for ML model input (e.g., GNN node features).
 */
export function featureVectorToArray(fv: import('@/utils/matchingEngine').FeatureVector): number[] {
  return [
    fv.styleSim,
    fv.budgetSim,
    fv.accommodationSim,
    fv.destinationMatch,
    fv.groupSizeSim,
    fv.interestJaccard,
    fv.sharedInterestCount,
    fv.dataCompleteness,
  ];
}
