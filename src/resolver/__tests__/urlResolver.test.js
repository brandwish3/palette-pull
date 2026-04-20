const { isValidUrl } = require('../urlResolver');

describe('isValidUrl', () => {
  it('returns true for valid https URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('returns true for valid http URL', () => {
    expect(isValidUrl('http://example.com/styles.css')).toBe(true);
  });

  it('returns false for a file path', () => {
    expect(isValidUrl('./tokens/colors.css')).toBe(false);
  });

  it('returns false for plain text', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  it('returns false for ftp protocol', () => {
    expect(isValidUrl('ftp://example.com/file')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });
});
