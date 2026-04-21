const { getHueFamily, getTemperature, analyzeTrends } = require('../trendAnalyzer');

describe('getHueFamily', () => {
  test('identifies red near 0', () => {
    expect(getHueFamily(5)).toBe('red');
  });

  test('identifies orange', () => {
    expect(getHueFamily(30)).toBe('orange');
  });

  test('identifies blue', () => {
    expect(getHueFamily(220)).toBe('blue');
  });

  test('identifies green', () => {
    expect(getHueFamily(120)).toBe('green');
  });

  test('identifies violet', () => {
    expect(getHueFamily(310)).toBe('violet');
  });
});

describe('getTemperature', () => {
  test('warm for red hues', () => {
    expect(getTemperature(10)).toBe('warm');
  });

  test('warm for orange hues', () => {
    expect(getTemperature(40)).toBe('warm');
  });

  test('cool for blue hues', () => {
    expect(getTemperature(210)).toBe('cool');
  });

  test('neutral for yellow-green boundary', () => {
    expect(getTemperature(90)).toBe('neutral');
  });
});

describe('analyzeTrends', () => {
  test('returns nulls for empty input', () => {
    const result = analyzeTrends([]);
    expect(result.dominantFamily).toBeNull();
    expect(result.temperature).toBeNull();
  });

  test('detects warm mood for red/orange palette', () => {
    const result = analyzeTrends(['#ff0000', '#ff6600', '#ff3300']);
    expect(result.temperature).toBe('warm');
    expect(result.mood).toBe('energetic');
  });

  test('detects cool mood for blue palette', () => {
    const result = analyzeTrends(['#0044ff', '#0088cc', '#003399']);
    expect(result.temperature).toBe('cool');
    expect(result.mood).toBe('calm');
  });

  test('identifies dominant family', () => {
    const result = analyzeTrends(['#0044ff', '#0055ee', '#ff0000']);
    expect(result.dominantFamily).toBe('blue');
  });

  test('handles near-gray colors gracefully', () => {
    const result = analyzeTrends(['#888888', '#999999', '#aaaaaa']);
    expect(result.dominantFamily).toBeNull();
    expect(result.temperatures.neutral).toBe(3);
  });
});
