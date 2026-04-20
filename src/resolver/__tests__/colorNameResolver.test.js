const {
  resolveColorName,
  generateTokenName,
  hexToRgb,
  colorDistance,
} = require('../colorNameResolver');

describe('hexToRgb', () => {
  it('converts pure red', () => {
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
  });

  it('converts pure blue', () => {
    expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
  });

  it('converts white', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
  });

  it('converts black', () => {
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
  });
});

describe('colorDistance', () => {
  it('returns 0 for identical colors', () => {
    expect(colorDistance([255, 0, 0], [255, 0, 0])).toBe(0);
  });

  it('returns non-zero for different colors', () => {
    expect(colorDistance([255, 0, 0], [0, 0, 255])).toBeGreaterThan(0);
  });
});

describe('resolveColorName', () => {
  it('returns exact name for known color', () => {
    expect(resolveColorName('#ff0000')).toBe('red');
    expect(resolveColorName('#ffffff')).toBe('white');
    expect(resolveColorName('#000000')).toBe('black');
  });

  it('is case-insensitive', () => {
    expect(resolveColorName('#FF0000')).toBe('red');
  });

  it('returns closest name for unknown color', () => {
    // Near red
    const name = resolveColorName('#fe0101');
    expect(name).toBe('red');
  });

  it('returns closest name for a dark gray', () => {
    const name = resolveColorName('#111111');
    expect(name).toBe('black');
  });
});

describe('generateTokenName', () => {
  it('returns base name for index 0', () => {
    expect(generateTokenName('#ff0000', 0)).toBe('red');
  });

  it('appends index+1 for non-zero index', () => {
    expect(generateTokenName('#ff0000', 1)).toBe('red-2');
    expect(generateTokenName('#ff0000', 2)).toBe('red-3');
  });
});
