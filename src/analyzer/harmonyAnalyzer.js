/**
 * Analyzes color harmony relationships within a palette.
 * Detects complementary, triadic, analogous, and split-complementary schemes.
 */

const { hexToRgb } = require('../resolver/colorNameResolver');

function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  return { h:), s: Math.round(s * 100), l: Math.round(l * 100) }eDiff(a, b) {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function detectHarmonyType(hues) {
  if (hues.length < 2) return 'monochromatic';

  const sorted = [...hues].sort((a, b) => a - b);
  const pairs = [];
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      pairs.push(hueDiff(sorted[i], sorted[j]));
    }
  }

  const hasComplementary = pairs.some(d => d >= 165 && d <= 195);
  const hasTriadic = hues.length >= 3 && pairs.some(d => d >= 115 && d <= 125);
  const hasAnalogous = pairs.every(d => d <= 45);

  if (hasTriadic) return 'triadic';
  if (hasComplementary && hues.length === 2) return 'complementary';
  if (hasComplementary) return 'split-complementary';
  if (hasAnalogous) return 'analogous';
  return 'custom';
}

function analyzeHarmony(colors) {
  const hslValues = colors.map(hex => ({ hex, ...hexToHsl(hex) }));
  const hues = hslValues.map(c => c.h);
  const harmonyType = detectHarmonyType(hues);
  const hueSpread = hues.length > 1
    ? Math.max(...hues) - Math.min(...hues)
    : 0;

  return {
    harmonyType,
    hueSpread,
    colors: hslValues,
  };
}

module.exports = { hexToHsl, hueDiff, detectHarmonyType, analyzeHarmony };
