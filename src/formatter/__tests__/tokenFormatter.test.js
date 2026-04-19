const { formatCSS, formatJSON, formatSCSS, formatTokens } = require('../tokenFormatter');

const colors = ['#ff0000', '#00ff00', '#0000ff'];

describe('formatCSS', () => {
  it('wraps variables in :root block', () => {
    const result = formatCSS(colors);
    expect(result).toMatch(/^:root \{/);
    expect(result).toMatch(/\}$/);
  });

  it('outputs correct CSS variables', () => {
    const result = formatCSS(colors, 'palette');
    expect(result).toContain('--palette-1: #ff0000;');
    expect(result).toContain('--palette-2: #00ff00;');
    expect(result).toContain('--palette-3: #0000ff;');
  });
});

describe('formatJSON', () => {
  it('returns an object with token entries', () => {
    const result = formatJSON(colors);
    expect(result['color-1']).toEqual({ value: '#ff0000', type: 'color' });
    expect(result['color-3']).toEqual({ value: '#0000ff', type: 'color' });
  });

  it('uses custom prefix', () => {
    const result = formatJSON(colors, 'brand');
    expect(result).toHaveProperty('brand-1');
  });
});

describe('formatSCSS', () => {
  it('outputs SCSS variable declarations', () => {
    const result = formatSCSS(colors);
    expect(result).toContain('$color-1: #ff0000;');
    expect(result).toContain('$color-2: #00ff00;');
  });

  it('uses custom prefix', () => {
    const result = formatSCSS(colors, 'theme');
    expect(result).toContain('$theme-1:');
  });
});

describe('formatTokens', () => {
  it('delegates to css formatter', () => {
    const result = formatTokens(colors, 'css');
    expect(result).toContain(':root');
  });

  it('delegates to scss formatter', () => {
    const result = formatTokens(colors, 'scss');
    expect(result).toContain('$color-1');
  });

  it('delegates to json formatter and returns string', () => {
    const result = formatTokens(colors, 'json');
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed['color-1'].value).toBe('#ff0000');
  });

  it('throws on unsupported format', () => {
    expect(() => formatTokens(colors, 'xml')).toThrow('Unsupported format');
  });
});
