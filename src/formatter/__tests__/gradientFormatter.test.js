const {
  sortByLightness,
  buildGradientString,
  formatGradientCSS,
  formatGradientJSON,
  formatGradientSCSS,
} = require('../gradientFormatter');

const sampleColors = ['#ff0000', '#00ff00', '#0000ff'];

describe('sortByLightness', () => {
  it('sorts colors from darkest to lightest', () => {
    const sorted = sortByLightness(['#ffffff', '#000000', '#888888']);
    expect(sorted[0]).toBe('#000000');
    expect(sorted[sorted.length - 1]).toBe('#ffffff');
  });

  it('returns a new array without mutating the original', () => {
    const original = ['#ffffff', '#000000'];
    sortByLightness(original);
    expect(original[0]).toBe('#ffffff');
  });
});

describe('buildGradientString', () => {
  it('builds a valid linear-gradient string', () => {
    const result = buildGradientString(['#ff0000', '#0000ff']);
    expect(result).toBe('linear-gradient(90deg, #ff0000, #0000ff)');
  });

  it('respects a custom angle', () => {
    const result = buildGradientString(['#ff0000', '#0000ff'], 45);
    expect(result).toContain('45deg');
  });

  it('throws if fewer than two colors are provided', () => {
    expect(() => buildGradientString(['#ff0000'])).toThrow(
      'At least two colors are required'
    );
  });
});

describe('formatGradientCSS', () => {
  it('returns a :root block with --palette-gradient', () => {
    const result = formatGradientCSS(sampleColors);
    expect(result).toContain(':root {');
    expect(result).toContain('--palette-gradient:');
    expect(result).toContain('linear-gradient(');
  });

  it('respects sorted=false option', () => {
    const result = formatGradientCSS(['#ff0000', '#0000ff'], { sorted: false });
    expect(result).toContain('#ff0000, #0000ff');
  });
});

describe('formatGradientJSON', () => {
  it('returns an object with a gradient token', () => {
    const result = formatGradientJSON(sampleColors);
    expect(result).toHaveProperty('gradient');
    expect(result.gradient).toHaveProperty('value');
    expect(result.gradient.type).toBe('gradient');
    expect(Array.isArray(result.gradient.colors)).toBe(true);
  });

  it('includes the angle in the token', () => {
    const result = formatGradientJSON(sampleColors, { angle: 135 });
    expect(result.gradient.angle).toBe(135);
    expect(result.gradient.value).toContain('135deg');
  });
});

describe('formatGradientSCSS', () => {
  it('returns a SCSS variable assignment', () => {
    const result = formatGradientSCSS(sampleColors);
    expect(result).toMatch(/^\$palette-gradient:/);
    expect(result).toContain('linear-gradient(');
  });
});
