# palette-pull

> CLI tool that extracts and exports color palettes from design files or URLs into various token formats

---

## Installation

```bash
npm install -g palette-pull
```

---

## Usage

Extract a color palette from a URL or local design file and export it as design tokens:

```bash
# Extract from a URL
palette-pull extract https://example.com --format css

# Extract from a local file
palette-pull extract ./design.figma --format json

# Specify an output file
palette-pull extract https://example.com --format scss --output ./tokens/colors.scss
```

### Supported Formats

| Flag | Output Format |
|------|--------------|
| `css` | CSS custom properties |
| `scss` | SCSS variables |
| `json` | JSON design tokens |
| `js` | JavaScript/ES module |

### Options

```
-f, --format <type>    Token output format (default: "json")
-o, --output <path>    Output file path
-v, --verbose          Show detailed extraction info
--help                 Display help information
```

---

## Example Output

```json
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6",
    "accent": "#F59E0B"
  }
}
```

---

## License

[MIT](./LICENSE)