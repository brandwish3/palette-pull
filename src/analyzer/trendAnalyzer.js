/**
 * Analyzes color palette trends by detecting dominant hues,
 * temperature (warm/cool/neutral), and overall mood.
 */

const { hexToHsl } = require('./harmonyAnalyzer');

/**
 * Classify a hue angle into a named color family.
 * @param {number} hue - 0–360
 * @returns {string}
 */
function getHueFamily(hue) {
  if (hue < 15 || hue >= 345) return 'red';
  if (hue < 45) return 'orange';
  if (hue < 75) return 'yellow';
  if (hue < 150) return 'green';
  if (hue < 195) return 'cyan';
  if (hue < 255) return 'blue';
  if (hue < 285) return 'indigo';
  if (hue < 345) return 'violet';
  return 'red';
}

/**
 * Determine temperature of a single hue.
 * @param {number} hue
 * @returns {'warm'|'cool'|'neutral'}
 */
function getTemperature(hue) {
  if ((hue >= 0 && hue < 60) || (hue >= 300 && hue <= 360)) return 'warm';
  if (hue >= 150 && hue < 300) return 'cool';
  return 'neutral';
}

/**
 * Analyze trends across a palette of hex colors.
 * @param {string[]} hexColors
 * @returns {object}
 */
function analyzeTrends(hexColors) {
  if (!hexColors || hexColors.length === 0) {
    return { dominantFamily: null, temperature: null, mood: null, families: {}, temperatures: {} };
  }

  const families = {};
  const temperatures = { warm: 0, cool: 0, neutral: 0 };

  for (const hex of hexColors) {
    const [h, s, l] = hexToHsl(hex);
    // Skip near-gray colors (low saturation)
    if (s < 10) {
      temperatures.neutral += 1;
      continue;
    }
    const family = getHueFamily(h);
    families[family] = (families[family] || 0) + 1;
    const temp = getTemperature(h);
    temperatures[temp] = (temperatures[temp] || 0) + 1;
  }

  const dominantFamily = Object.keys(families).sort((a, b) => families[b] - families[a])[0] || null;
  const dominantTemp = Object.keys(temperatures).sort((a, b) => temperatures[b] - temperatures[a])[0];

  const mood =
    dominantTemp === 'warm' ? 'energetic' :
    dominantTemp === 'cool' ? 'calm' :
    'balanced';

  return { dominantFamily, temperature: dominantTemp, mood, families, temperatures };
}

module.exports = { getHueFamily, getTemperature, analyzeTrends };
