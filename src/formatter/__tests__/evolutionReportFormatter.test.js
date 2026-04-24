const {
  generateEvolutionReport,
  generateEvolutionJSON,
} = require('../evolutionReportFormatter');

const sampleEvolution = {
  added: ['#aabbcc'],
  removed: ['#112233'],
  modified: [{ before: '#336699', after: '#336798' }],
  unchanged: ['#ffffff'],
  totalChanges: 3,
  stabilityScore: 50,
};

describe('generateEvolutionReport', () => {
  it('includes stability score', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('Stability Score: 50%');
  });

  it('includes total changes', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('Total Changes: 3');
  });

  it('lists added colors with + prefix', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('+ #aabbcc');
  });

  it('lists removed colors with - prefix', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('- #112233');
  });

  it('lists modified colors with ~ prefix', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('~ #336699 -> #336798');
  });

  it('lists unchanged colors with = prefix', () => {
    const report = generateEvolutionReport(sampleEvolution);
    expect(report).toContain('= #ffffff');
  });

  it('omits sections with no entries', () => {
    const minimal = { added: [], removed: [], modified: [], unchanged: ['#fff'], totalChanges: 0, stabilityScore: 100 };
    const report = generateEvolutionReport(minimal);
    expect(report).not.toContain('Added');
    expect(report).not.toContain('Removed');
  });
});

describe('generateEvolutionJSON', () => {
  it('returns valid JSON', () => {
    const json = generateEvolutionJSON(sampleEvolution);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('includes all keys', () => {
    const parsed = JSON.parse(generateEvolutionJSON(sampleEvolution));
    expect(parsed).toHaveProperty('added');
    expect(parsed).toHaveProperty('removed');
    expect(parsed).toHaveProperty('modified');
    expect(parsed).toHaveProperty('stabilityScore');
  });
});
