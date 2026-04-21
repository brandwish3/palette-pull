import { resolveInput } from '../resolver/inputResolver.js';
import { extractColors, deduplicateColors } from '../extractor/colorExtractor.js';
import { analyzeHarmony } from '../analyzer/harmonyAnalyzer.js';
import { generateHarmonyReport, generateHarmonyJSON, printHarmonyReport } from '../formatter/harmonyReportFormatter.js';
import { exportTokens } from '../exporter/fileExporter.js';

/**
 * Runs the harmony analysis command.
 * @param {string} input - File path or URL to analyze.
 * @param {object} options - CLI options.
 */
export async function harmonyCommand(input, options = {}) {
  const { output, format = 'text', json = false, silent = false } = options;

  let content;
  try {
    content = await resolveInput(input);
  } catch (err) {
    console.error(`Error resolving input: ${err.message}`);
    process.exit(1);
  }

  const rawColors = extractColors(content);
  if (!rawColors.length) {
    console.error('No colors found in the provided input.');
    process.exit(1);
  }

  const colors = deduplicateColors(rawColors);

  let harmonyResult;
  try {
    harmonyResult = analyzeHarmony(colors);
  } catch (err) {
    console.error(`Error analyzing harmony: ${err.message}`);
    process.exit(1);
  }

  if (json || format === 'json') {
    const jsonResult = generateHarmonyJSON(harmonyResult);
    if (output) {
      try {
        await exportTokens(JSON.stringify(jsonResult, null, 2), output);
        if (!silent) console.log(`Harmony JSON exported to ${output}`);
      } catch (err) {
        console.error(`Error writing output: ${err.message}`);
        process.exit(1);
      }
    } else {
      console.log(JSON.stringify(jsonResult, null, 2));
    }
    return;
  }

  const report = generateHarmonyReport(harmonyResult);

  if (output) {
    try {
      await exportTokens(report, output);
      if (!silent) console.log(`Harmony report exported to ${output}`);
    } catch (err) {
      console.error(`Error writing output: ${err.message}`);
      process.exit(1);
    }
  } else if (!silent) {
    printHarmonyReport(harmonyResult);
  }
}
