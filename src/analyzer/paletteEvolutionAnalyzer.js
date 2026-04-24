/**
 * Analyzes how a palette has evolved between two snapshots.
 * Detects added, removed, and modified colors.
 */

const { colorDistance } = require('../resolver/colorNameResolver');
const { hexToRgb } = require('../resolver/colorNameResolver');

const MODIFICATION_THRESHOLD = 25;

/**
 * @param {string[]} before - hex colors from previous snapshot
 * @param {string[]} after  - hex colors from current snapshot
 * @returns {{ added: string[], removed: string[], modified: Array<{before: string, after: string}>, unchanged: string[] }}
 */
function compareSnapshots(before, removed_placeholder, after) {
  const added = [];
  const removed = [];
  const modified = [];
  const unchanged = [];

  const afterCopy = [...after];

  for (const bColor of before) {
    const bRgb = hexToRgb(bColor);
    if (!bRgb) continue;

    let bestMatch = null;
    let bestDist = Infinity;
    let bestIdx = -1;

    afterCopy.forEach((aColor, idx) => {
      const aRgb = hexToRgb(aColor);
      if (!aRgb) return;
      const dist = colorDistance(bRgb, aRgb);
      if (dist < bestDist) {
        bestDist = dist;
        bestMatch = aColor;
        bestIdx = idx;
      }
    });

    if (bestDist === 0) {
      unchanged.push(bColor);
      afterCopy.splice(bestIdx, 1);
    } else if (bestDist <= MODIFICATION_THRESHOLD) {
      modified.push({ before: bColor, after: bestMatch });
      afterCopy.splice(bestIdx, 1);
    } else {
      removed.push(bColor);
    }
  }

  added.push(...afterCopy);

  return { added, removed, modified, unchanged };
}

/**
 * @param {string[]} before
 * @param {string[]} after
 * @returns {object}
 */
function analyzePaletteEvolution(before, after) {
  const diff = compareSnapshots(before, null, after);
  const totalChanges = diff.added.length + diff.removed.length + diff.modified.length;
  const stabilityScore = before.length > 0
    ? Math.round((diff.unchanged.length / before.length) * 100)
    : 0;

  return { ...diff, totalChanges, stabilityScore };
}

module.exports = { compareSnapshots, analyzePaletteEvolution };
