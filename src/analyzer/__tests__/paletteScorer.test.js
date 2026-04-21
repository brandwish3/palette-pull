const { calcHueSpread, calcAccessibilityScore, scorePalette } = require('../paletteScorer');

describe('calcHueSpread', () => {
  test('returns 0 for a single color', () => {
    expect(calcHueSpread(['#ff0000'])).toBe(0);
  });

  test('returns higher score for well-spread hues', () => {
    // Red, Green, Blue — evenly spread at ~120° apart
    const score = calcHueSpread(['#ff0000', '#00ff00', '#0000ff']);
    expect(score).toBeGreaterThan(60);
  });

  test('returns lower score for similar hues', () => {
    const score = calcHueSpread(['#ff0000', '#ff1100', '#ff2200']);
    expect(score).toBeLessThan(30);
  });

  test('handles achromatic colors gracefully', () => {
    const score = calcHueSpread(['#000000', '#ffffff']);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('calcAccessibilityScore', () => {
  test('returns 0 for empty palette', () => {
    expect(calcAccessibilityScore([])).toBe(0);
  });

  test('returns 0 for single color', () => {
    expect(calcAccessibilityScore(['#ff0000'])).toBe(0);
  });

  test('returns 100 for black and white', () => {
    expect(calcAccessibilityScore(['#000000', '#ffffff'])).toBe(100);
  });

  test('returns lower score for low-contrast pairs', () => {
    const score = calcAccessibilityScore(['#aaaaaa', '#bbbbbb']);
    expect(score).toBeLessThan(50);
  });
});

describe('scorePalette', () => {
  test('returns all four score keys', () => {
    const result = scorePalette(['#000000', '#ffffff', '#ff0000']);
    expect(result).toHaveProperty('diversity');
    expect(result).toHaveProperty('accessibility');
    expect(result).toHaveProperty('size');
    expect(result).toHaveProperty('overall');
  });

  test('overall is between 0 and 100', () => {
    const result = scorePalette(['#000000', '#ffffff']);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  test('size score caps at 100 for 10+ colors', () => {
    const colors = Array.from({ length: 12 }, (_, i) =>
      `#${i.toString(16).padStart(2, '0')}0000`
    );
    const result = scorePalette(colors);
    expect(result.size).toBe(100);
  });
});
