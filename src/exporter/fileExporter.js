const fs = require('fs');
const path = require('path');

/**
 * Ensures the output directory exists, creating it if necessary.
 * @param {string} filePath - Full file path
 */
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Writes content to a file at the given output path.
 * @param {string} outputPath - Destination file path
 * @param {string} content - File content to write
 * @returns {{ success: boolean, filePath: string, error?: string }}
 */
function writeToFile(outputPath, content) {
  try {
    const resolved = path.resolve(outputPath);
    ensureDir(resolved);
    fs.writeFileSync(resolved, content, 'utf8');
    return { success: true, filePath: resolved };
  } catch (err) {
    return { success: false, filePath: outputPath, error: err.message };
  }
}

/**
 * Resolves the output file path based on format if no explicit path given.
 * @param {string|undefined} outputPath - User-supplied path (optional)
 * @param {string} format - Token format: css | scss | json
 * @returns {string}
 */
function resolveOutputPath(outputPath, format) {
  if (outputPath) return outputPath;
  const extensions = { css: 'tokens.css', scss: '_tokens.scss', json: 'tokens.json' };
  return extensions[format] || 'tokens.txt';
}

/**
 * Exports formatted token content to a file.
 * @param {string} content - Formatted token string
 * @param {string} format - css | scss | json
 * @param {string|undefined} outputPath - Optional explicit output path
 * @returns {{ success: boolean, filePath: string, error?: string }}
 */
function exportTokens(content, format, outputPath) {
  const target = resolveOutputPath(outputPath, format);
  return writeToFile(target, content);
}

module.exports = { ensureDir, writeToFile, resolveOutputPath, exportTokens };
