/**
 * Formats trend analysis results into various output formats.
 */

const TEMPERATURE_LABELS = {
  warm: '🔴 Warm',
  cool: '🔵 Cool',
  neutral: '⚪ Neutral',
};

function formatTrendLine(hueFamily, count, total) {
  const pct = ((count / total) * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(pct / 5));
  return `  ${hueFamily.padEnd(12)} ${bar.padEnd(20)} ${pct}% (${count})`;
}

function generateTrendReport(trendResult) {
  const { hueFamilies, temperature, dominantFamily, totalColors } = trendResult;
  const lines = [];

  lines.push('=== Color Trend Analysis ===');
  lines.push(`Total colors analyzed: ${totalColors}`);
  lines.push(`Dominant family: ${dominantFamily}`);
  lines.push(`Overall temperature: ${TEMPERATURE_LABELS[temperature] || temperature}`);
  lines.push('');
  lines.push('Hue Family Distribution:');

  Object.entries(hueFamilies)
    .sort((a, b) => b[1] - a[1])
    .forEach(([family, count]) => {
      lines.push(formatTrendLine(family, count, totalColors));
    });

  return lines.join('\n');
}

function generateTrendJSON(trendResult) {
  return JSON.stringify(trendResult, null, 2);
}

function printTrendReport(trendResult) {
  console.log(generateTrendReport(trendResult));
}

module.exports = {
  formatTrendLine,
  generateTrendReport,
  generateTrendJSON,
  printTrendReport,
};
