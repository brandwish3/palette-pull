const {
  getLuminance,
  getContrastRatio,
  getWcagLevel,
  analyzeContrast,
} = require('../contrastAnalyzer');

describe('getLuminance', () => {
  it('returns 0 for black', () => {
    expect(getLuminance('#000000')).toBeCloseTo(0, 4);
  });

  it('returns 1 for white', () => {
    expect(getLuminance('#ffffff')).toBeCloseTo(1, 4);
  });

  it('returns a value between 0 and 1 for mid-tone colors', () => {
    const l = getLuminance('#888888');
    expect(l).toBeGreaterThan(0);
    expect(l).toBeLessThan(1);
  });
});

describe('getContrastRatio', () => {
  it('returns 21 for black vs white', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBe(21);
  });

  it('returns 1 for identical colors', () => {
    expect(getContrastRatio('#ff0000', '#ff0000')).toBe(1);
  });

  it('is symmetric', () => {
    const r1 = getContrastRatio('#123456', '#abcdef');
    const r2 = getContrastRatio('#abcdef', '#123456');
    expect(r1).toBe(r2);
  });
});

describe('getWcagLevel', () => {
  it('marks ratio >= 7 as AAA', () => {
    expect(getWcagLevel(7).AAA).toBe(true);
  });

  it('marks ratio >= 4.5 as AA', () => {
    expect(getWcagLevel(4.5).AA).toBe(true);
    expect(getWcagLevel(4.5).AAA).toBe(false);
  });

  it('marks ratio >= 3 as AALarge only', () => {
    const level = getWcagLevel(3);
    expect(level.AALarge).toBe(true);
    expect(level.AA).toBe(false);
  });

  it('fails all levels for low contrast', () => {
    const level = getWcagLevel(1.5);
    expect(level.AA).toBe(false);
    expect(level.AAA).toBe(false);
    expect(level.AALarge).toBe(false);
  });
});

describe('analyzeContrast', () => {
  it('returns correct number of pairs', () => {
    const colors = ['#000000', '#ffffff', '#ff0000'];
    const results = analyzeContrast(colors);
    expect(results).toHaveLength(3);
  });

  it('includes color1, color2, ratio and wcag in each result', () => {
    const results = analyzeContrast(['#000000', '#ffffff']);
    expect(results[0]).toHaveProperty('color1');
    expect(results[0]).toHaveProperty('color2');
    expect(results[0]).toHaveProperty('ratio');
    expect(results[0]).toHaveProperty('wcag');
  });

  it('returns empty array for single color', () => {
    expect(analyzeContrast(['#ff0000'])).toEqual([]);
  });
});
