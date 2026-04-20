const {
  assignTokenNames,
  formatNamedCSS,
  formatNamedJSON,
  formatNamedSCSS,
} = require('./namedTokenFormatter');

describe('namedTokenFormatter', () => {
  const mockColors = ['#FF5733', '#3498DB', '#2ECC71'];

  describe('assignTokenNames', () => {
    it('should assign token names to each color', () => {
      const result = assignTokenNames(mockColors);
      expect(result).toHaveLength(3);
      result.forEach((entry) => {
        expect(entry).toHaveProperty('hex');
        expect(entry).toHaveProperty('name');
        expect(entry).toHaveProperty('token');
      });
    });

    it('should return empty array for empty input', () => {
      expect(assignTokenNames([])).toEqual([]);
    });

    it('should produce unique token names for each color', () => {
      const result = assignTokenNames(mockColors);
      const tokens = result.map((entry) => entry.token);
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(tokens.length);
    });
  });

  describe('formatNamedCSS', () => {
    it('should produce valid CSS custom properties', () => {
      const result = formatNamedCSS(mockColors);
      expect(result).toContain(':root {');
      expect(result).toContain('--color-');
      expect(result).toContain('#');
      expect(result).toContain('}');
    });

    it('should return empty :root block for no colors', () => {
      const result = formatNamedCSS([]);
      expect(result).toContain(':root {');
      expect(result).toContain('}');
    });
  });

  describe('formatNamedJSON', () => {
    it('should produce valid JSON with named keys', () => {
      const result = formatNamedJSON(mockColors);
      const parsed = JSON.parse(result);
      expect(typeof parsed).toBe('object');
      const keys = Object.keys(parsed);
      expect(keys.length).toBe(3);
      keys.forEach((key) => {
        expect(key).toMatch(/^color-/);
        expect(parsed[key]).toMatch(/^#/);
      });
    });

    it('should return valid JSON for empty input', () => {
      const result = formatNamedJSON([]);
      expect(() => JSON.parse(result)).not.toThrow();
      expect(Object.keys(JSON.parse(result)).length).toBe(0);
    });
  });

  describe('formatNamedSCSS', () => {
    it('should produce valid SCSS variables', () => {
      const result = formatNamedSCSS(mockColors);
      expect(result).toContain('$color-');
      expect(result).toContain(':');
      expect(result).toContain(';');
    });

    it('should return empty string for no colors', () => {
      expect(formatNamedSCSS([])).toBe('');
    });
  });
});
