/**
 * Result of a performance benchmark.
 */
export interface BenchmarkResult {
  /** Average execution time in milliseconds */
  avg: number;
  /** Minimum execution time in milliseconds */
  min: number;
  /** Maximum execution time in milliseconds */
  max: number;
  /** Number of runs performed */
  runs: number;
}

/**
 * Measure the execution time of an async function over multiple runs.
 *
 * @param fn - The async function to benchmark
 * @param options - Optional configuration
 * @returns Benchmark results with avg, min, max, and runs
 */
export async function measureRenderTime(
  fn: () => Promise<void>,
  options?: { runs?: number; warmup?: number }
): Promise<BenchmarkResult> {
  const runs = options?.runs ?? 5;
  const warmup = options?.warmup ?? 1;

  // Warmup runs (not measured)
  for (let i = 0; i < warmup; i++) {
    await fn();
  }

  const times: number[] = [];

  for (let i = 0; i < runs; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);

  return { avg, min, max, runs };
}

/**
 * Assert that a timing value is within a performance budget.
 *
 * @param actual - Actual time in milliseconds
 * @param budgetMs - Maximum allowed time in milliseconds
 */
export function expectWithinBudget(actual: number, budgetMs: number): void {
  if (actual > budgetMs) {
    throw new Error(
      `Performance budget exceeded: ${actual.toFixed(2)}ms > ${budgetMs}ms budget (${((actual / budgetMs - 1) * 100).toFixed(1)}% over)`
    );
  }
}
