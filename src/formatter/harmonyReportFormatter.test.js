import { formatHarmonyLine, generateHarmonyReport, generateHarmonyJSON, printHarmonyReport } from './harmonyReportFormatter.js';

const mockHarmonyResult = {
  type: 'complementary',
  confidence: 0.87,
  colors: ['#e63946', '#46e6d9'],
  description: 'Two colors opposite on the color wheel',
};

const mockMultiHarmony = {
  type: 'triadic',
  confidence: 0.72,
  colors: ['#e63946', '#46e639', '#3946e6'],
  description: 'Three colors evenly spaced on the color wheel',
};

describe('formatHarmonyLine', () => {
  it('formats a harmony result line', () => {
    const line = formatHarmonyLine(mockHarmonyResult);
    expect(line).toContain('complementary');
    expect(line).toContain('87%');
  });

  it('includes color count in output', () => {
    const line = formatHarmonyLine(mockHarmonyResult);
    expect(line).toContain('2');
  });
});

describe('generateHarmonyReport', () => {
  it('returns a string report', () => {
    const report = generateHarmonyReport(mockHarmonyResult);
    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(0);
  });

  it('includes harmony type and description', () => {
    const report = generateHarmonyReport(mockHarmonyResult);
    expect(report).toContain('complementary');
    expect(report).toContain('Two colors opposite on the color wheel');
  });

  it('lists all colors in the palette', () => {
    const report = generateHarmonyReport(mockMultiHarmony);
    expect(report).toContain('#e63946');
    expect(report).toContain('#46e639');
    expect(report).toContain('#3946e6');
  });
});

describe('generateHarmonyJSON', () => {
  it('returns a valid JSON object', () => {
    const result = generateHarmonyJSON(mockHarmonyResult);
    expect(typeof result).toBe('object');
    expect(result.type).toBe('complementary');
    expect(result.confidence).toBe(0.87);
    expect(Array.isArray(result.colors)).toBe(true);
  });

  it('includes description field', () => {
    const result = generateHarmonyJSON(mockHarmonyResult);
    expect(result.description).toBeDefined();
  });
});

describe('printHarmonyReport', () => {
  it('calls console.log with the report', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    printHarmonyReport(mockHarmonyResult);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
