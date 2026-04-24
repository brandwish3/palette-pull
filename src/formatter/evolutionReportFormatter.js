/**
 * Formats palette evolution analysis results into text and JSON reports.
 */

const chalk = require('chalk');

/**
 * @param {{ added: string[], removed: string[], modified: Array<{before:string,after:string}>, unchanged: string[], totalChanges: number, stabilityScore: number }} evolution
 * @returns {string}
 */
function generateEvolutionReport(evolution) {
  const lines = [];
  lines.push('=== Palette Evolution Report ===');
  lines.push(`Stability Score: ${evolution.stabilityScore}%`);
  lines.push(`Total Changes: ${evolution.totalChanges}`);
  lines.push('');

  if (evolution.added.length) {
    lines.push(`Added (${evolution.added.length}):`);
    evolution.added.forEach(c => lines.push(`  + ${c}`));
  }

  if (evolution.removed.length) {
    lines.push(`Removed (${evolution.removed.length}):`);
    evolution.removed.forEach(c => lines.push(`  - ${c}`));
  }

  if (evolution.modified.length) {
    lines.push(`Modified (${evolution.modified.length}):`);
    evolution.modified.forEach(({ before, after }) =>
      lines.push(`  ~ ${before} -> ${after}`)
    );
  }

  if (evolution.unchanged.length) {
    lines.push(`Unchanged (${evolution.unchanged.length}):`);
    evolution.unchanged.forEach(c => lines.push(`  = ${c}`));
  }

  return lines.join('\n');
}

/**
 * @param {object} evolution
 * @returns {string}
 */
function generateEvolutionJSON(evolution) {
  return JSON.stringify(evolution, null, 2);
}

/**
 * @param {object} evolution
 */
function printEvolutionReport(evolution) {
  const report = generateEvolutionReport(evolution);
  const colored = report
    .replace(/^  \+ .+/gm, m => chalk.green(m))
    .replace(/^  - .+/gm, m => chalk.red(m))
    .replace(/^  ~ .+/gm, m => chalk.yellow(m))
    .replace(/^  = .+/gm, m => chalk.gray(m));
  console.log(colored);
}

module.exports = { generateEvolutionReport, generateEvolutionJSON, printEvolutionReport };
