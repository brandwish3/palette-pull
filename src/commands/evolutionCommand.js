/**
 * CLI command: compare two palette snapshots and report evolution.
 * Usage: palette-pull evolution --before <file|url> --after <file|url> [--format text|json]
 */

const { resolveInput } = require('../resolver/inputResolver');
const { extractColors, deduplicateColors } = require('../extractor/colorExtractor');
const { analyzePaletteEvolution } = require('../analyzer/paletteEvolutionAnalyzer');
const {
  generateEvolutionReport,
  generateEvolutionJSON,
  printEvolutionReport,
} = require('../formatter/evolutionReportFormatter');
const { exportTokens } = require('../exporter/fileExporter');

async function evolutionCommand(options) {
  const { before, after, format = 'text', output } = options;

  if (!before || !after) {
    console.error('Error: --before and --after are required.');
    process.exit(1);
  }

  let beforeContent, afterContent;
  try {
    beforeContent = await resolveInput(before);
    afterContent = await resolveInput(after);
  } catch (err) {
    console.error(`Error resolving inputs: ${err.message}`);
    process.exit(1);
  }

  const beforeColors = deduplicateColors(extractColors(beforeContent));
  const afterColors = deduplicateColors(extractColors(afterContent));

  const evolution = analyzePaletteEvolution(beforeColors, afterColors);

  if (output) {
    const content =
      format === 'json'
        ? generateEvolutionJSON(evolution)
        : generateEvolutionReport(evolution);
    const ext = format === 'json' ? 'json' : 'txt';
    await exportTokens(content, output, ext);
    console.log(`Evolution report written to ${output}`);
  } else {
    if (format === 'json') {
      console.log(generateEvolutionJSON(evolution));
    } else {
      printEvolutionReport(evolution);
    }
  }
}

module.exports = { evolutionCommand };
