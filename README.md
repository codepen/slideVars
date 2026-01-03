# @codepen/slidevars

A TypeScript library that creates interactive UI controls for CSS custom properties (CSS variables). Provides sliders for numeric values and color pickers for colors, all rendered in a Shadow DOM web component. Built with Lit for reactive, declarative templates.

- **[Demo & Documentation](https://codepen.github.io/slideVars/)**
- **[Basic Usage Pen](https://codepen.io/chriscoyier/pen/raLxxRY)**
- **[GitHub](https://github.com/codepen/slideVars)**
- **[npm](https://www.npmjs.com/package/@codepen/slidevars)**

## Installation

```bash
npm install @codepen/slidevars
```

## Usage

### Auto-Detection (Easiest!)

Just define CSS variables in your stylesheet and call `init()` with no arguments:

```css
:root {
  --box-size: 150px;
  --box-color: #9c27b0;
  --border-radius: 20px;
  --font-size: 18px;
}
```

```javascript
import { slideVars } from "@codepen/slidevars";

slideVars.init(); // That's it! Auto-detects all CSS variables
```

SlideVars will:

- Scan `:root` for all CSS custom properties
- Detect colors (hex, rgb, hsl, named colors) → create color pickers
- Detect values with units (px, rem, em, %, etc.) → create sliders with smart defaults
- Skip values it can't understand

### Manual Configuration

For more control, configure each variable manually:

```javascript
import { slideVars } from "@codepen/slidevars";

slideVars.init(
  {
    "--width": {
      type: "slider",
      min: 10,
      max: 100,
      default: 50,
      unit: "px",
      scope: "#animation", // Apply to specific element
    },
    "--bg": {
      type: "color",
      default: "red",
    },
  },
  {
    defaultOpen: false, // Optional: set to true to show controls on load
  }
);
```

There are only `slider` and `color` types for now.

### Hybrid Approach

Combine auto-detection with manual overrides:

```javascript
slideVars.init(
  {
    // Manual config overrides auto-detected values
    "--box-size": {
      type: "slider",
      min: 50,
      max: 500, // Custom range instead of default
      unit: "px",
    },
  },
  {
    auto: true, // Explicitly enable auto-detection
  }
);
```

This will inject a `<slide-vars>` web component into the `<body>` as a fixed-position toggle button (🎛️) in the top right. Click it to open/close the controls.

## Development

### Run the Demo Locally

To test the library with the interactive demo/documentation:

```bash
npm install
npm run example
```

This will start a dev server at `http://localhost:3000` with a comprehensive single-page demo that includes:

- **Live Demo** - Interactive examples with tabs for auto-detection and manual configuration
- **Full Documentation** - Installation, API reference, and usage examples
- **Feature Showcase** - See all features in action

The dev server supports hot reloading, so changes to the source files will update automatically.

### Build the Library

```bash
npm run build
```

This uses Vite 7 with Rolldown (a fast Rust-based bundler) to create the distributable files in the `dist/` folder. All styles are bundled into the JavaScript output (no separate CSS file).

### Build the Demo Site

```bash
npm run build:demo
```

This builds the demo/documentation site to the `docs/` folder. The site is automatically deployed to GitHub Pages on every push to the main branch.

### Logo Component

Just for fuzies, the library includes a custom `<slidevars-logo>` component that displays three animated range sliders. The sliders animate to different positions when the panel opens/closes:

```html
<slidevars-logo open="false"></slidevars-logo>
```

## Advanced Usage

### Manual Placement with Custom Content

By default, `slideVars.init()` creates and injects the `<slide-vars>` element automatically. However, you can manually place it in your HTML to control its position and add custom content via slots:

```html
<!-- Place the element wherever you want in your HTML -->
<slide-vars>
  <h2>🎛️ Control Panel</h2>
  <p>Adjust the values below to customize your design:</p>
</slide-vars>
```

This approach gives you:

- **Custom positioning** - Place the element anywhere in your DOM structure
- **Slotted content** - Add custom HTML that appears above the controls

### Programmatic Control

```javascript
// Open the controls panel
slideVars.open();

// Close the controls panel
slideVars.close();

// Toggle the controls panel
slideVars.toggle();

// Destroy the component entirely
slideVars.destroy();

// Get the element reference
const element = slideVars.getElement();
```

### Options

The second parameter to `init()` accepts options:

```typescript
interface SlideVarsOptions {
  defaultOpen?: boolean; // Whether controls are open on load (default: false)
  auto?: boolean; // Enable auto-detection (default: true if config is empty)
  scope?: string; // Selector to read variables from (default: ":root")
}
```

Examples:

```javascript
// Auto-detect from :root (default)
slideVars.init();

// Auto-detect from specific element
slideVars.init({}, { scope: "#my-component" });

// Open controls by default
slideVars.init({}, { defaultOpen: true });

// Manual config only (disable auto-detection)
slideVars.init(
  { "--my-var": { type: "slider", min: 0, max: 100, unit: "px" } },
  { auto: false }
);
```

### Default Slider Ranges

Auto-detected sliders use these default ranges by unit type. Based on [MDN CSS numeric data types](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Values_and_units/Numeric_data_types):

**Length Units:**

- Absolute: `px`, `cm`, `mm`, `in`, `pt`, `pc`, `q`
- Font-relative: `em`, `rem`, `ex`, `rex`, `cap`, `rcap`, `ch`, `rch`, `ic`, `ric`, `lh`, `rlh`
- Viewport: `vw`, `vh`, `vi`, `vb`, `vmin`, `vmax`, `svw`, `svh`, `svi`, `svb`, `lvw`, `lvh`, `dvw`, `dvh`, `dvi`, `dvb`
- Container: `cqw`, `cqh`, `cqi`, `cqb`, `cqmin`, `cqmax`

**Other Units:**

- Angle: `deg` (0-360), `grad` (0-400), `rad` (0-6.28), `turn` (0-1)
- Time: `s` (0-10), `ms` (0-5000)
- Frequency: `Hz` (0-20000), `kHz` (0-20)
- Resolution: `dpi` (72-600), `dpcm` (28-236), `dppx` (1-4)
- Percentage: `%` (0-100)
- Flex: `fr` (0-10)

Ranges automatically expand if the current value is outside the defaults.

### Color Detection

Auto-detected color variables support:

- Hex: `#rgb`, `#rrggbb`, `#rrggbbaa`
- Functional: `rgb()`, `rgba()`, `hsl()`, `hsla()`
- Named: standard CSS named colors (including `transparent` and `currentColor`)

Note: newer color syntaxes (like `oklch()` / `color()`) aren’t currently auto-detected.

## API

### `slideVars.init(config?: SlideVarsConfig, options?: SlideVarsOptions)`

Initialize the component. If `config` is empty or omitted, auto-detects CSS variables from `:root`.

### `slideVars.destroy()`

Remove the component from the DOM.

### `slideVars.getElement()`

Get a reference to the underlying `SlideVarsElement` instance.

## TypeScript Support

This library is written in TypeScript and includes full type definitions. Import types as needed:

```typescript
import {
  slideVars,
  SlideVarsConfig,
  SliderConfig,
  ColorConfig,
} from "@codepen/slidevars";
```

## License

MIT © CodePen
