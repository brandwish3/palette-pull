const {
  hexToHsl,
  hueDiff,
  detectHarmonyType,
  analyzeHarmony,
} = require('../harmonyAnalyzer');

describe('hexToHsl', () => {
  it('converts red correctly', () => {
    const { h, s, l } = hexToHsl('#ff0000');
    expect(h).toBe(0);
    expect(s).toBe(100);
    expect(l).toBe(50);
  });

  it('converts white correctly', () => {
    const { h, s, l } = hexToHsl('#ffffff');
    expect(s).toBe(0);
    expect(l).toBe(100);
  });

  it('converts a mid-tone blue', () => {
    const { h } = hexToHsl('#0000ff');
    expect(h).toBe(240);
  });
});

describe('hueDiff', () => {
  it('returns 0 for identical hues', () => {
    expect(hueDiff(120, 120)).toBe(0);
  });

  it('returns correct diff across 0/360 boundary', () => {
    expect(hueDiff(10, 350)).toBe(20);
  });

  it('returns 180 for complementary hues', () => {
    expect(hueDiff(0, 180)).toBe(180);
  });
});

describe('detectHarmonyType', () => {
  it('detects monochromatic for single hue', () => {
    expect(detectHarmonyType([30])).toBe('monochromatic');
  });

  it('detects complementary for two opposite hues', () => {
    expect(detectHarmonyType([0, 180])).toBe('complementary');
  });

  it('detects analogous for closely spaced hues', () => {
    expect(detectHarmonyType([10, 20, 30])).toBe('analogous');
  });

  it('detects triadic for three evenly spaced hues', () => {
    expect(detectHarmonyType([0, 120, 240])).toBe('triadic');
  });
});

describe('analyzeHarmony', () => {
  it('returns harmony type and hue spread', () => {
    const result = analyzeHarmony(['#ff0000', '#00ff00', '#0000ff']);
    expect(result).toHaveProperty('harmonyType');
    expect(result).toHaveProperty('hueSpread');
    expect(result.colors).toHaveLength(3);
  });

  it('includes h, s, l for each color', () => {
    const result = analyzeHarmony(['#ff0000']);
    expect(result.colors[0]).toMatchObject({ hex: '#ff0000', h: 0, s: 100, l: 50 });
  });
});
