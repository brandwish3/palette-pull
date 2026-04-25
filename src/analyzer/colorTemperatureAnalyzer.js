/**
 * Analyzes the overall temperature distribution of a color palette.
 * Classifies colors as warm, cool, or neutral based on hue.
 */

/**
 * Convert hex to HSL
 * @param {string} hex
 * @returns {{ h: number, s: number, l: number }}
 */
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Classify a hue angle as warm, cool, or neutral.
 * @param {number} hue - 0–360
 * @param {number} saturation - 0–100
 * @returns {'warm'|'cool'|'neutral'}
 */
function classifyTemperature(hue, saturation) {
  if (saturation < 10) return 'neutral';
  if ((hue >= 0 && hue < 60) || (hue >= 300 && hue <= 360)) return 'warm';
  if (hue >= 60 && hue < 180) return 'neutral';
  return 'cool';
}

/**
 * Analyze temperature distribution across a palette.
 * @param {string[]} colors - Array of hex color strings
 * @returns {{ warm: number, cool: number, neutral: number, dominant: string, breakdown: object[] }}
 */
function analyzeColorTemperature(colors) {
  const counts = { warm: 0, cool: 0, neutral: 0 };
  const breakdown = colors.map((hex) => {
    const { h, s, l } = hexToHsl(hex);
    const temperature = classifyTemperature(h, s);
    counts[temperature]++;
    return { hex, hue: Math.round(h), saturation: Math.round(s), lightness: Math.round(l), temperature };
  });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return {
    warm: counts.warm,
    cool: counts.cool,
    neutral: counts.neutral,
    dominant,
    breakdown,
  };
}

module.exports = { hexToHsl, classifyTemperature, analyzeColorTemperature };
