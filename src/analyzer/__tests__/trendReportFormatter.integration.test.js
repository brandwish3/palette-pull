/**
 * Integration tests: trendAnalyzer -> trendReportFormatter pipeline.
 */

const { analyzeTrends } = require('../trendAnalyzer');
const {
  generateTrendReport,
  generateTrendJSON,
} = require('../../formatter/trendReportFormatter');

const warmPalette = ['#ff4500', '#ff6347', '#ff8c00', '#ffa500', '#dc143c'];
const coolPalette = ['#1e90ff', '#00bfff', '#4169e1', '#6495ed', '#00ced1'];
const mixedPalette = ['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff'];

describe('trendAnalyzer + trendReportFormatter integration', () => {
  it('reports warm temperature for warm palette', () => {
    const result = analyzeTrends(warmPalette);
    const report = generateTrendReport(result);
    expect(result.temperature).toBe('warm');
    expect(report).toContain('Warm');
  });

  it('reports cool temperature for cool palette', () => {
    const result = analyzeTrends(coolPalette);
    const report = generateTrendReport(result);
    expect(result.temperature).toBe('cool');
    expect(report).toContain('Cool');
  });

  it('includes correct total color count in report', () => {
    const result = analyzeTrends(mixedPalette);
    const report = generateTrendReport(result);
    expect(report).toContain(`Total colors analyzed: ${mixedPalette.length}`);
  });

  it('produces valid JSON from mixed palette', () => {
    const result = analyzeTrends(mixedPalette);
    const json = generateTrendJSON(result);
    const parsed = JSON.parse(json);
    expect(parsed).toHaveProperty('dominantFamily');
    expect(parsed).toHaveProperty('hueFamilies');
    expect(parsed.totalColors).toBe(mixedPalette.length);
  });

  it('dominant family has the highest count in hue families', () => {
    const result = analyzeTrends(warmPalette);
    const { dominantFamily, hueFamilies } = result;
    const maxCount = Math.max(...Object.values(hueFamilies));
    expect(hueFamilies[dominantFamily]).toBe(maxCount);
  });
});
