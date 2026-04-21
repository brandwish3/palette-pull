/**
 * Formats harmony analysis results into human-readable and JSON reports.
 */

const { analyzeHarmony } = require('../analyzer/harmonyAnalyzer');

function formatHarmonyLine(colorEntry) {
  return `  ${colorEntry.hex}  H:${String(colorEntry.h).padStart(3)}°  S:${String(colorEntry.s).padStart(3)}%  L:${String(colorEntry.l).padStart(3)}%`;
}

function generateHarmonyReport(colors) {
  const result = analyzeHarmony(colors);
  const lines = [
    `Harmony Type : ${result.harmonyType}`,
    `Hue Spread   : ${result.hueSpread}°`,
    '',
    'Colors (HSL):',
    ...result.colors.map(formatHarmonyLine),
  ];
  return lines.join('\n');
}

function generateHarmonyJSON(colors) {
  const result = analyzeHarmony(colors);
  return JSON.stringify(
    {
      harmonyType: result.harmonyType,
      hueSpread: result.hueSpread,
      colors: result.colors,
    },
    null,
    2
  );
}

function printHarmonyReport(colors) {
  console.log('\n=== Harmony Analysis ===\n');
  console.log(generateHarmonyReport(colors));
  console.log();
}

module.exports = {
  formatHarmonyLine,
  generateHarmonyReport,
  generateHarmonyJSON,
  printHarmonyReport,
};
