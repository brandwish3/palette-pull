#!/usr/bin/env node

'use strict';

const { program } = require('commander');
const axios = require('axios');
const { extractColors, deduplicateColors } = require('./extractor/colorExtractor');
const { version } = require('../package.json');

program
  .name('palette-pull')
  .description('Extract color palettes from design files or URLs')
  .version(version);

program
  .command('extract <url>')
  .description('Extract colors from a URL')
  .option('-f, --format <format>', 'Output format: json | css | list', 'list')
  .action(async (url, options) => {
    try {
      console.log(`Fetching: ${url}`);
      const response = await axios.get(url);
      const text = response.data;

      const raw = extractColors(typeof text === 'string' ? text : JSON.stringify(text));
      const colors = deduplicateColors(raw);

      if (colors.length === 0) {
        console.log('No colors found.');
        return;
      }

      switch (options.format) {
        case 'json':
          console.log(JSON.stringify({ colors }, null, 2));
          break;
        case 'css':
          console.log(':root {');
          colors.forEach((c, i) => console.log(`  --color-${i + 1}: ${c};`));
          console.log('}');
          break;
        default:
          console.log(`Found ${colors.length} color(s):`);
          colors.forEach(c => console.log(` - ${c}`));
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  });

program.parse(process.argv);
