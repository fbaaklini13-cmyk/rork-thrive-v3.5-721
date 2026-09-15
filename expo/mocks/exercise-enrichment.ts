import exerciseLibrary from '@/data/exercise-library.json';

/**
 * Per-exercise enrichment for the 873-entry library in all-exercises-data.ts, which only
 * carries name | muscles | equipment | difficulty. This file adds what that pipe-delimited
 * source lacks: step-by-step instructions, a one-line description and the two demonstration
 * frames (start / end position) from the open free-exercise-db dataset, referenced by URL so
 * the ~100 MB of JPGs are not bundled into the app.
 *
 * Keyed by the same id rule all-exercises-data.ts uses (createId), so lookups are O(1) and
 * survive re-generation of either file. Regenerate data/exercise-library.json with
 * scripts/build-exercise-library.py from a free-exercise-db checkout.
 */
export interface ExerciseEnrichment {
  description: string;
  instructions: string[];
  imageUrls: string[];
}

interface LibraryEntry {
  name: string;
  description?: string;
  instructions?: string[];
  imageUrls?: string[];
}

const createId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const byId: Record<string, ExerciseEnrichment> = {};
for (const entry of exerciseLibrary as LibraryEntry[]) {
  const id = createId(entry.name);
  if (byId[id]) continue; // first wins; the dataset has no exact-name duplicates but be safe
  byId[id] = {
    description: entry.description ?? '',
    instructions: entry.instructions ?? [],
    imageUrls: entry.imageUrls ?? [],
  };
}

export function getExerciseEnrichment(exerciseId: string): ExerciseEnrichment | undefined {
  return byId[exerciseId];
}
