const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Fetches raw HTML/CSS content from a URL
 * @param {string} rawUrl
 * @returns {Promise<string>}
 */
function fetchContent(rawUrl) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch (e) {
      return reject(new Error(`Invalid URL: ${rawUrl}`));
    }

    const client = parsed.protocol === 'https:' ? https : http;

    client.get(rawUrl, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Request failed with status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Validates whether a string is a valid HTTP/HTTPS URL
 * @param {string} input
 * @returns {boolean}
 */
function isValidUrl(input) {
  try {
    const { protocol } = new URL(input);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { fetchContent, isValidUrl };
