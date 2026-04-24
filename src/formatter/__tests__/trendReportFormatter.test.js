const {
  formatTrendLine,
  generateTrendReport,
  generateTrendJSON,
  printTrendReport,
} = require('../trendReportFormatter');

const mockTrendResult = {
  totalColors: 8,
  dominantFamily: 'blue',
  temperature: 'cool',
  hueFamilies: {
    blue: 4,
    red: 2,
    green: 1,
    purple: 1,
  },
};

describe('formatTrendLine', () => {
  it('formats a hue family line with percentage and bar', () => {
    const line = formatTrendLine('blue', 4, 8);
    expect(line).toContain('blue');
    expect(line).toContain('50.0%');
    expect(line).toContain('(4)');
  });

  it('pads the family name to consistent width', () => {
    const line = formatTrendLine('red', 2, 8);
    expect(line).toMatch(/red\s+/);
  });
});

describe('generateTrendReport', () => {
  it('includes header and total color count', () => {
    const report = generateTrendReport(mockTrendResult);
    expect(report).toContain('Color Trend Analysis');
    expect(report).toContain('Total colors analyzed: 8');
  });

  it('includes dominant family', () => {
    const report = generateTrendReport(mockTrendResult);
    expect(report).toContain('Dominant family: blue');
  });

  it('includes temperature label', () => {
    const report = generateTrendReport(mockTrendResult);
    expect(report).toContain('Cool');
  });

  it('lists all hue families sorted by count', () => {
    const report = generateTrendReport(mockTrendResult);
    const blueIdx = report.indexOf('blue');
    const redIdx = report.lastIndexOf('red');
    expect(blueIdx).toBeLessThan(redIdx);
  });
});

describe('generateTrendJSON', () => {
  it('returns valid JSON string', () => {
    const json = generateTrendJSON(mockTrendResult);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('includes all trend fields', () => {
    const parsed = JSON.parse(generateTrendJSON(mockTrendResult));
    expect(parsed.dominantFamily).toBe('blue');
    expect(parsed.temperature).toBe('cool');
    expect(parsed.totalColors).toBe(8);
  });
});

describe('printTrendReport', () => {
  it('calls console.log with report string', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printTrendReport(mockTrendResult);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Color Trend Analysis'));
    spy.mockRestore();
  });
});
