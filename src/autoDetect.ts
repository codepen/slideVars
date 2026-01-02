import type { SlideVarsConfig, CSSUnit, AutoDetectDefaults } from "./types";

const DEFAULT_SLIDER_RANGES: Record<string, { min: number; max: number; step?: number }> = {
  px: { min: 0, max: 500, step: 1 },
  rem: { min: 0, max: 10, step: 0.1 },
  em: { min: 0, max: 10, step: 0.1 },
  "%": { min: 0, max: 100, step: 1 },
  vw: { min: 0, max: 100, step: 1 },
  vh: { min: 0, max: 100, step: 1 },
  dvw: { min: 0, max: 100, step: 1 },
  dvh: { min: 0, max: 100, step: 1 },
  ch: { min: 0, max: 100, step: 1 },
  ex: { min: 0, max: 100, step: 1 },
  deg: { min: 0, max: 360, step: 1 },
  s: { min: 0, max: 10, step: 0.1 },
  ms: { min: 0, max: 5000, step: 50 },
};

export function autoDetectVariables(
  scope: string = ":root",
  customDefaults?: AutoDetectDefaults
): SlideVarsConfig {
  const config: SlideVarsConfig = {};
  
  // Get the element to read variables from
  const element = document.querySelector(scope);
  if (!element) {
    console.warn(`slideVars: Could not find element matching "${scope}"`);
    return config;
  }

  // Get computed styles
  const computedStyles = window.getComputedStyle(element);
  
  // Get all custom properties
  const customProps: string[] = [];
  for (let i = 0; i < computedStyles.length; i++) {
    const prop = computedStyles[i];
    if (prop.startsWith("--")) {
      customProps.push(prop);
    }
  }

  // Merge custom defaults with built-in defaults
  const sliderRanges = {
    ...DEFAULT_SLIDER_RANGES,
    ...(customDefaults?.sliderRanges || {}),
  };

  // Parse each custom property
  customProps.forEach((propName) => {
    const value = computedStyles.getPropertyValue(propName).trim();
    if (!value) return;

    const detected = detectValueType(value, propName, sliderRanges);
    if (detected) {
      config[propName] = detected;
    }
  });

  return config;
}

function detectValueType(
  value: string,
  propName: string,
  sliderRanges: Record<string, { min: number; max: number; step?: number }>
): SlideVarsConfig[string] | null {
  // Try to detect color
  if (isColor(value)) {
    return {
      type: "color",
      default: value,
    };
  }

  // Try to detect numeric value with unit
  const numericMatch = value.match(/^(-?\d+\.?\d*)\s*([a-z%]+)$/i);
  if (numericMatch) {
    const [, numStr, unit] = numericMatch;
    const currentValue = parseFloat(numStr);
    
    const range = sliderRanges[unit];
    if (range) {
      // Adjust range if current value is outside defaults
      let { min, max, step } = range;
      if (currentValue < min) min = Math.floor(currentValue);
      if (currentValue > max) max = Math.ceil(currentValue * 1.5);

      return {
        type: "slider",
        min,
        max,
        default: currentValue,
        unit: unit as CSSUnit,
        step,
      };
    }
  }

  // Can't detect type
  return null;
}

function isColor(value: string): boolean {
  // Check for hex colors
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value)) {
    return true;
  }

  // Check for rgb/rgba
  if (/^rgba?\(/.test(value)) {
    return true;
  }

  // Check for hsl/hsla
  if (/^hsla?\(/.test(value)) {
    return true;
  }

  // Check for named colors
  const namedColors = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque",
    "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood",
    "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk",
    "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray",
    "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen",
    "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen",
    "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
    "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue",
    "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
    "ghostwhite", "gold", "goldenrod", "gray", "grey", "green", "greenyellow",
    "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral",
    "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen",
    "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen",
    "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid",
    "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen",
    "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream",
    "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive",
    "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
    "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
    "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown",
    "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell",
    "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow",
    "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise",
    "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen",
    "transparent", "currentcolor"
  ];

  return namedColors.includes(value.toLowerCase());
}

