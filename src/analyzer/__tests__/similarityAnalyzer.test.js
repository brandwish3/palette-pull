const {
  groupSimilarColors,
  findRedundantPairs,
  calcDiversityScore,
} = require('../similarityAnalyzer');

describe('groupSimilarColors', () => {
  it('groups identical colors together', () => {
    const colors = ['#ff0000', '#ff0101', '#0000ff'];
    const groups = groupSimilarColors(colors, 10);
    expect(groups.length).toBe(2);
  });

  it('returns one group per color when all are distinct', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const groups = groupSimilarColors(colors, 5);
    expect(groups.length).toBe(3);
  });

  it('handles empty input', () => {
    expect(groupSimilarColors([])).toEqual([]);
  });

  it('each group has a representative', () => {
    const colors = ['#aabbcc', '#aabbcd'];
    const groups = groupSimilarColors(colors, 20);
    groups.forEach(g => {
      expect(g.representative).toBeDefined();
      expect(g.group).toContain(g.representative);
    });
  });
});

describe('findRedundantPairs', () => {
  it('detects near-identical colors as redundant', () => {
    const colors = ['#ff0000', '#ff0101'];
    const pairs = findRedundantPairs(colors, 10);
    expect(pairs.length).toBe(1);
    expect(pairs[0]).toHaveProperty('a');
    expect(pairs[0]).toHaveProperty('b');
    expect(pairs[0]).toHaveProperty('distance');
  });

  it('returns empty array when no redundant pairs', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const pairs = findRedundantPairs(colors, 5);
    expect(pairs.length).toBe(0);
  });

  it('handles single color input', () => {
    expect(findRedundantPairs(['#ff0000'], 15)).toEqual([]);
  });
});

describe('calcDiversityScore', () => {
  it('returns 0 for fewer than 2 colors', () => {
    expect(calcDiversityScore([])).toBe(0);
    expect(calcDiversityScore(['#ff0000'])).toBe(0);
  });

  it('returns a positive number for diverse colors', () => {
    const score = calcDiversityScore(['#ff0000', '#00ff00', '#0000ff']);
    expect(score).toBeGreaterThan(0);
  });

  it('returns a low score for very similar colors', () => {
    const similar = calcDiversityScore(['#ff0000', '#ff0101']);
    const diverse = calcDiversityScore(['#ff0000', '#0000ff']);
    expect(similar).toBeLessThan(diverse);
  });
});
