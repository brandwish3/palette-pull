const {
  hexToHsl,
  classifyTemperature,
  analyzeColorTemperature,
} = require('../colorTemperatureAnalyzer');

describe('hexToHsl', () => {
  it('converts pure red to hsl', () => {
    const { h, s, l } = hexToHsl('#ff0000');
    expect(Math.round(h)).toBe(0);
    expect(Math.round(s)).toBe(100);
    expect(Math.round(l)).toBe(50);
  });

  it('converts pure blue to hsl', () => {
    const { h } = hexToHsl('#0000ff');
    expect(Math.round(h)).toBe(240);
  });

  it('converts white to neutral lightness', () => {
    const { s, l } = hexToHsl('#ffffff');
    expect(Math.round(s)).toBe(0);
    expect(Math.round(l)).toBe(100);
  });
});

describe('classifyTemperature', () => {
  it('classifies red as warm', () => {
    expect(classifyTemperature(0, 80)).toBe('warm');
  });

  it('classifies orange as warm', () => {
    expect(classifyTemperature(30, 70)).toBe('warm');
  });

  it('classifies blue as cool', () => {
    expect(classifyTemperature(220, 60)).toBe('cool');
  });

  it('classifies purple as cool', () => {
    expect(classifyTemperature(280, 50)).toBe('cool');
  });

  it('classifies low-saturation color as neutral', () => {
    expect(classifyTemperature(200, 5)).toBe('neutral');
  });

  it('classifies yellow-green as neutral', () => {
    expect(classifyTemperature(90, 60)).toBe('neutral');
  });
});

describe('analyzeColorTemperature', () => {
  const palette = ['#ff4500', '#1e90ff', '#808080', '#e63946', '#457b9d'];

  it('returns correct counts', () => {
    const result = analyzeColorTemperature(palette);
    expect(result.warm + result.cool + result.neutral).toBe(palette.length);
  });

  it('returns a breakdown entry per color', () => {
    const result = analyzeColorTemperature(palette);
    expect(result.breakdown).toHaveLength(palette.length);
  });

  it('identifies a dominant temperature', () => {
    const result = analyzeColorTemperature(palette);
    expect(['warm', 'cool', 'neutral']).toContain(result.dominant);
  });

  it('handles a single warm color', () => {
    const result = analyzeColorTemperature(['#ff0000']);
    expect(result.warm).toBe(1);
    expect(result.dominant).toBe('warm');
  });

  it('handles an empty palette', () => {
    const result = analyzeColorTemperature([]);
    expect(result.warm).toBe(0);
    expect(result.cool).toBe(0);
    expect(result.neutral).toBe(0);
    expect(result.breakdown).toHaveLength(0);
  });
});
