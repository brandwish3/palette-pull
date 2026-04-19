const fs = require('fs');
const path = require('path');
const os = require('os');
const { writeToFile, resolveOutputPath, exportTokens } = require('../fileExporter');

describe('resolveOutputPath', () => {
  test('returns provided path when given', () => {
    expect(resolveOutputPath('custom/output.css', 'css')).toBe('custom/output.css');
  });

  test('defaults to tokens.css for css format', () => {
    expect(resolveOutputPath(undefined, 'css')).toBe('tokens.css');
  });

  test('defaults to _tokens.scss for scss format', () => {
    expect(resolveOutputPath(undefined, 'scss')).toBe('_tokens.scss');
  });

  test('defaults to tokens.json for json format', () => {
    expect(resolveOutputPath(undefined, 'json')).toBe('tokens.json');
  });

  test('defaults to tokens.txt for unknown format', () => {
    expect(resolveOutputPath(undefined, 'xml')).toBe('tokens.txt');
  });
});

describe('writeToFile', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-pull-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('writes content to file and returns success', () => {
    const filePath = path.join(tmpDir, 'output.css');
    const result = writeToFile(filePath, ':root { --color: #fff; }');
    expect(result.success).toBe(true);
    expect(fs.readFileSync(result.filePath, 'utf8')).toBe(':root { --color: #fff; }');
  });

  test('creates nested directories if they do not exist', () => {
    const filePath = path.join(tmpDir, 'nested', 'deep', 'tokens.json');
    const result = writeToFile(filePath, '{"color": "#fff"}');
    expect(result.success).toBe(true);
    expect(fs.existsSync(result.filePath)).toBe(true);
  });

  test('returns failure result on invalid path', () => {
    const result = writeToFile('', 'content');
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('exportTokens', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'palette-pull-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('exports tokens to resolved path', () => {
    const out = path.join(tmpDir, 'result.css');
    const result = exportTokens(':root {}', 'css', out);
    expect(result.success).toBe(true);
    expect(fs.readFileSync(result.filePath, 'utf8')).toBe(':root {}');
  });
});
