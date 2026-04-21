const {
  formatRedundantPairLine,
  generateSimilarityReport,
  generateSimilarityJSON,
  printSimilarityReport,
} = require('./similarityReportFormatter');

describe('formatRedundantPairLine', () => {
  it('formats a redundant pair with distance', () => {
    const line = formatRedundantPairLine('#ff0000', '#fe0101', 2.1);
    expect(line).toContain('#ff0000');
    expect(line).toContain('#fe0101');
    expect(line).toContain('2.1');
  });

  it('includes a warning symbol', () => {
    const line = formatRedundantPairLine('#aabbcc', '#aabbcd', 0.5);
    expect(line).toMatch(/[⚠!]/);
  });
});

describe('generateSimilarityReport', () => {
  const pairs = [
    { a: '#ff0000', b: '#fe0101', distance: 2.1 },
    { a: '#0000ff', b: '#0001ff', distance: 1.3 },
  ];

  it('returns a non-empty report string', () => {
    const report = generateSimilarityReport(pairs, 0.8);
    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
  });

  it('includes all color pairs', () => {
    const report = generateSimilarityReport(pairs, 0.8);
    expect(report).toContain('#ff0000');
    expect(report).toContain('#0000ff');
  });

  it('includes diversity score', () => {
    const report = generateSimilarityReport(pairs, 0.8);
    expect(report).toContain('0.8');
  });

  it('handles empty pairs gracefully', () => {
    const report = generateSimilarityReport([], 1.0);
    expect(report).toContain('1');
  });
});

describe('generateSimilarityJSON', () => {
  it('returns a valid JSON string', () => {
    const pairs = [{ a: '#aaa', b: '#bbb', distance: 5.0 }];
    const json = generateSimilarityJSON(pairs, 0.6);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('diversityScore');
    expect(parsed).toHaveProperty('redundantPairs');
    expect(Array.isArray(parsed.redundantPairs)).toBe(true);
  });

  it('reflects the correct diversity score', () => {
    const json = generateSimilarityJSON([], 0.95);
    const parsed = JSON.parse(json);
    expect(parsed.diversityScore).toBe(0.95);
  });
});

describe('printSimilarityReport', () => {
  it('calls console.log without throwing', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    expect(() =>
      printSimilarityReport([{ a: '#111', b: '#222', distance: 3 }], 0.7)
    ).not.toThrow();
    spy.mockRestore();
  });
});
