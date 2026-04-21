const {
  formatContrastLine,
  generateContrastReport,
  generateContrastJSON,
} = require('../contrastReportFormatter');

describe('formatContrastLine', () => {
  it('includes both colors and ratio', () => {
    const line = formatContrastLine({
      color1: '#000000',
      color2: '#ffffff',
      ratio: 21,
      wcag: { AA: true, AAA: true, AALarge: true },
    });
    expect(line).toContain('#000000');
    expect(line).toContain('#ffffff');
    expect(line).toContain('21:1');
  });

  it('labels AAA when ratio >= 7', () => {
    const line = formatContrastLine({
      color1: '#000000',
      color2: '#ffffff',
      ratio: 21,
      wcag: { AA: true, AAA: true, AALarge: true },
    });
    expect(line).toContain('AAA');
  });

  it('labels FAIL for low contrast', () => {
    const line = formatContrastLine({
      color1: '#aaaaaa',
      color2: '#bbbbbb',
      ratio: 1.2,
      wcag: { AA: false, AAA: false, AALarge: false },
    });
    expect(line).toContain('FAIL');
  });

  it('labels AA Large when only AALarge passes', () => {
    const line = formatContrastLine({
      color1: '#555555',
      color2: '#ffffff',
      ratio: 3.5,
      wcag: { AA: false, AAA: false, AALarge: true },
    });
    expect(line).toContain('AA Large');
  });
});

describe('generateContrastReport', () => {
  it('returns a string with header for multiple colors', () => {
    const report = generateContrastReport(['#000000', '#ffffff']);
    expect(typeof report).toBe('string');
    expect(report).toContain('Contrast Report');
  });

  it('returns fallback message for single color', () => {
    const report = generateContrastReport(['#ff0000']);
    expect(report).toBe('No color pairs to compare.');
  });

  it('includes all pair lines', () => {
    const colors = ['#000000', '#ffffff', '#ff0000'];
    const report = generateContrastReport(colors);
    const lines = report.split('\n').filter((l) => l.includes('→'));
    expect(lines).toHaveLength(3);
  });
});

describe('generateContrastJSON', () => {
  it('returns array of pair objects', () => {
    const results = generateContrastJSON(['#000000', '#ffffff']);
    expect(Array.isArray(results)).toBe(true);
    expect(results[0]).toHaveProperty('pair');
    expect(results[0]).toHaveProperty('ratio');
    expect(results[0]).toHaveProperty('wcag');
  });

  it('pair is an array of two hex strings', () => {
    const results = generateContrastJSON(['#000000', '#ffffff']);
    expect(results[0].pair).toHaveLength(2);
  });
});
