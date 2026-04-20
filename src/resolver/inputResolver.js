const { fetchContent, isValidUrl } = require('./urlResolver');
const { readFile, isSupportedFile } = require('./fileResolver');

/**
 * Resolves input (URL or file path) to raw content string
 * @param {string} input - URL or file path
 * @returns {Promise<{ content: string, source: 'url' | 'file' }>}
 */
async function resolveInput(input) {
  if (isValidUrl(input)) {
    const content = await fetchContent(input);
    return { content, source: 'url' };
  }

  if (!isSupportedFile(input)) {
    throw new Error(
      `Unsupported file type: "${input}". Supported extensions are .css, .scss, .html, .json, .svg`
    );
  }

  const content = readFile(input);
  return { content, source: 'file' };
}

module.exports = { resolveInput };
