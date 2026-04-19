const { extractColors, deduplicateColors, normalizeHex } = require('../colorExtractor');

describe('normalizeHex', () => {
  test('expands 3-digit hex to 6-digit', () => {
    expect(normalizeHex('#fff')).toBe('#ffffff');
    expect(normalizeHex('#abc')).toBe('#aabbcc');
  });

  test('lowercases 6-digit hex', () => {
    expect(normalizeHex('#FF5733')).toBe('#ff5733');
  });

  test('trims to 6 digits if 8-digit provided', () => {
    expect(normalizeHex('#ff573380')).toBe('#ff5733');
  });
});

describe('extractColors', () => {
  test('extracts hex colors from text', () => {
    const css = 'color: #ff5733; background: #abc;';
    const result = extractColors(css);
    expect(result).toContain('#ff5733');
    expect(result).toContain('#aabbcc');
  });

  test('extracts rgb colors', () => {
    const css = 'color: rgb(255, 87, 51);';
    const result = extractColors(css);
    expect(result).toContain('rgb(255,87,51)');
  });

  test('extracts rgba colors', () => {
    const css = 'color: rgba(0, 0, 0, 0.5);';
    const result = extractColors(css);
    expect(result).toContain('rgba(0,0,0,0.5)');
  });

  test('extracts hsl colors', () => {
    const css = 'color: hsl(120, 100%, 50%);';
    const result = extractColors(css);
    expect(result).toContain('hsl(120,100%,50%)');
  });

  test('returns empty array for no colors', () => {
    expect(extractColors('no colors here')).toEqual([]);
  });
});

describe('deduplicateColors', () => {
  test('removes duplicate colors', () => {
    const colors = ['#ff5733', '#ff5733', '#aabbcc'];
    expect(deduplicateColors(colors)).toEqual(['#aabbcc', '#ff5733']);
  });

  test('returns sorted array', () => {
    const colors = ['#zzz', '#aaa', '#mmm'];
    expect(deduplicateColors(colors)).toEqual(['#aaa', '#mmm', '#zzz']);
  });
});
