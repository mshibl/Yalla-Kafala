/**
 * Checks a caller-supplied shared secret against the configured one.
 *
 * Fails closed: when no secret is configured (undefined or empty), every
 * call is rejected. The comparison walks the whole string instead of stopping
 * at the first differing character, so response time doesn't reveal how much
 * of a guess was right. (The length can still differ; that is acceptable.)
 */
export function secretMatches(
  provided: string,
  expected: string | undefined,
): boolean {
  if (!expected) return false;

  let diff = provided.length ^ expected.length;
  for (let i = 0; i < expected.length; i++) {
    diff |= (provided.charCodeAt(i) || 0) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
