const {
  getGrade,
  formatScoreLine,
  generateScoreReport,
  generateScoreJSON,
} = require('../scoreReportFormatter');

describe('getGrade', () => {
  test('returns A for 90+', () => expect(getGrade(95)).toBe('A'));
  test('returns B for 75-89', () => expect(getGrade(80)).toBe('B'));
  test('returns C for 60-74', () => expect(getGrade(65)).toBe('C'));
  test('returns D for 40-59', () => expect(getGrade(50)).toBe('D'));
  test('returns F for below 40', () => expect(getGrade(30)).toBe('F'));
  test('boundary: 90 is A', () => expect(getGrade(90)).toBe('A'));
  test('boundary: 75 is B', () => expect(getGrade(75)).toBe('B'));
});

describe('formatScoreLine', () => {
  test('includes label and score', () => {
    const line = formatScoreLine('Diversity', 80);
    expect(line).toContain('Diversity');
    expect(line).toContain('80');
  });

  test('includes grade letter', () => {
    const line = formatScoreLine('Accessibility', 95);
    expect(line).toContain('[A]');
  });

  test('includes bar characters', () => {
    const line = formatScoreLine('Size', 50);
    expect(line).toContain('█');
    expect(line).toContain('░');
  });
});

describe('generateScoreReport', () => {
  const scores = { diversity: 80, accessibility: 70, size: 60, overall: 72 };
  const colors = ['#000000', '#ffffff', '#ff0000'];

  test('includes all score categories', () => {
    const report = generateScoreReport(scores, colors);
    expect(report).toContain('Hue Diversity');
    expect(report).toContain('Accessibility');
    expect(report).toContain('Palette Size');
    expect(report).toContain('Overall Score');
  });

  test('includes color count', () => {
    const report = generateScoreReport(scores, colors);
    expect(report).toContain('3');
  });
});

describe('generateScoreJSON', () => {
  const scores = { diversity: 85, accessibility: 100, size: 30, overall: 78 };
  const colors = ['#000000', '#ffffff'];

  test('returns correct colorsAnalyzed', () => {
    const result = generateScoreJSON(scores, colors);
    expect(result.colorsAnalyzed).toBe(2);
  });

  test('each score has value and grade', () => {
    const result = generateScoreJSON(scores, colors);
    expect(result.scores.diversity).toEqual({ value: 85, grade: 'B' });
    expect(result.scores.accessibility).toEqual({ value: 100, grade: 'A' });
    expect(result.scores.overall).toEqual({ value: 78, grade: 'B' });
  });
});
