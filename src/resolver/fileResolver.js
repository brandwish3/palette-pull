const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = ['.css', '.scss', '.html', '.json', '.svg'];

/**
 * Reads file content from disk
 * @param {string} filePath
 * @returns {string}
 */
function readFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  return fs.readFileSync(resolved, 'utf8');
}

/**
 * Checks if a file path has a supported extension
 * @param {string} filePath
 * @returns {boolean}
 */
function isSupportedFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * Returns the extension of a file
 * @param {string} filePath
 * @returns {string}
 */
function getFileExtension(filePath) {
  return path.extname(filePath).toLowerCase();
}

module.exports = { readFile, isSupportedFile, getFileExtension, SUPPORTED_EXTENSIONS };
