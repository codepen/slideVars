# @codepen/slidevars

A TypeScript library that creates interactive UI controls for CSS custom properties (CSS variables). Provides sliders for numeric values and color pickers for colors, all rendered in a Shadow DOM web component. Built with Lit for reactive, declarative templates.

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

### Run the Demo

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

## Technology Stack

- **Lit 3.2+** - Reactive web components with declarative templates (~5KB)
- **TypeScript** - Full type safety
- **Vite 7** - Fast bundler with Rolldown (Rust-based)
- **Shadow DOM** - Encapsulated styles and markup
- **Animated SVG Logo** - Custom `<slidevars-logo>` component with smooth transitions

### Why Lit?

- 🪶 **Lightweight** - Only ~5KB gzipped
- ⚡ **Fast** - Efficient reactive updates
- 🎯 **Simple** - Declarative HTML templates
- 🔧 **Standard** - Built on web components standards
- 📦 **No Virtual DOM** - Direct DOM manipulation

### Logo Component

The library includes a custom `<slidevars-logo>` component that displays three animated range sliders. The sliders animate to different positions when the panel opens/closes:

```html
<slidevars-logo open="false"></slidevars-logo>
```

You can use this logo independently in your own projects!

### Slider Configuration

```javascript
{
  "--my-var": {
    type: "slider",
    min: 10,           // Required: minimum value
    max: 100,          // Required: maximum value
    default: 50,       // Optional: defaults to halfway between min/max
    unit: "px",        // Required: CSS unit (px, rem, em, vw, vh, %, etc.)
    scope: "#myEl",    // Optional: selector for where to apply the variable (defaults to body)
    step: 1            // Optional: step increment (defaults to 1)
  }
}
```

### Color Configuration

```javascript
{
  "--my-color": {
    type: "color",
    default: "red",    // Optional: any valid CSS color (defaults to #ff0000)
    scope: "#myEl"     // Optional: selector for where to apply the variable (defaults to body)
  }
}
```

## Advanced Usage

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

### Styling with Slots

The component uses Shadow DOM, which means you can provide custom content via slots:

```html
<slide-vars>
  <h2>Controls</h2>
  <p>Adjust the values below:</p>
</slide-vars>
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

Auto-detected sliders use these default ranges by unit:

| Unit   | Min | Max  | Step |
| ------ | --- | ---- | ---- |
| px     | 0   | 500  | 1    |
| rem/em | 0   | 10   | 0.1  |
| %      | 0   | 100  | 1    |
| vw/vh  | 0   | 100  | 1    |
| deg    | 0   | 360  | 1    |
| s      | 0   | 10   | 0.1  |
| ms     | 0   | 5000 | 50   |

Ranges automatically expand if the current value is outside the defaults.

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
