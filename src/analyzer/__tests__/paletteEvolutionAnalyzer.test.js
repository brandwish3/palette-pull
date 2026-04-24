const { compareSnapshots, analyzePaletteEvolution } = require('../paletteEvolutionAnalyzer');

describe('compareSnapshots', () => {
  it('detects added colors', () => {
    const result = compareSnapshots([], null, ['#ff0000']);
    expect(result.added).toContain('#ff0000');
    expect(result.removed).toHaveLength(0);
  });

  it('detects removed colors', () => {
    const result = compareSnapshots(['#ff0000'], null, []);
    expect(result.removed).toContain('#ff0000');
    expect(result.added).toHaveLength(0);
  });

  it('detects unchanged colors', () => {
    const result = compareSnapshots(['#336699'], null, ['#336699']);
    expect(result.unchanged).toContain('#336699');
    expect(result.modified).toHaveLength(0);
  });

  it('detects modified colors within threshold', () => {
    // #336699 and #336798 are close but not identical
    const result = compareSnapshots(['#336699'], null, ['#336798']);
    expect(result.modified.length + result.unchanged.length).toBeGreaterThan(0);
  });

  it('handles empty before and after', () => {
    const result = compareSnapshots([], null, []);
    expect(result.added).toHaveLength(0);
    expect(result.removed).toHaveLength(0);
    expect(result.unchanged).toHaveLength(0);
  });
});

describe('analyzePaletteEvolution', () => {
  it('returns stabilityScore of 100 when nothing changed', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const result = analyzePaletteEvolution(colors, colors);
    expect(result.stabilityScore).toBe(100);
    expect(result.totalChanges).toBe(0);
  });

  it('returns stabilityScore of 0 when all replaced', () => {
    const result = analyzePaletteEvolution(['#ff0000'], ['#123456']);
    expect(result.stabilityScore).toBe(0);
  });

  it('counts totalChanges correctly', () => {
    const result = analyzePaletteEvolution(['#aabbcc'], ['#aabbcc', '#112233']);
    expect(result.totalChanges).toBe(1); // one added
  });

  it('returns 0 stabilityScore for empty before', () => {
    const result = analyzePaletteEvolution([], ['#ff0000']);
    expect(result.stabilityScore).toBe(0);
  });
});
