import type { SlideVarsConfig, CSSUnit, AutoDetectDefaults } from "./types";

const DEFAULT_SLIDER_RANGES: Record<
  string,
  { min: number; max: number; step?: number }
> = {
  // Unit-less numbers (e.g. line-height: 1.4)
  "": { min: 0, max: 5, step: 0.1 },

  // Absolute length units
  px: { min: 0, max: 500, step: 1 },
  cm: { min: 0, max: 50, step: 0.1 },
  mm: { min: 0, max: 500, step: 1 },
  in: { min: 0, max: 20, step: 0.1 },
  pt: { min: 0, max: 100, step: 1 },
  pc: { min: 0, max: 50, step: 1 },
  Q: { min: 0, max: 1000, step: 1 },

  // Font-relative length units
  em: { min: 0, max: 10, step: 0.1 },
  rem: { min: 0, max: 10, step: 0.1 },
  ex: { min: 0, max: 100, step: 1 },
  rex: { min: 0, max: 100, step: 1 },
  cap: { min: 0, max: 100, step: 1 },
  rcap: { min: 0, max: 100, step: 1 },
  ch: { min: 0, max: 100, step: 1 },
  rch: { min: 0, max: 100, step: 1 },
  ic: { min: 0, max: 100, step: 1 },
  ric: { min: 0, max: 100, step: 1 },
  lh: { min: 0, max: 10, step: 0.1 },
  rlh: { min: 0, max: 10, step: 0.1 },

  // Viewport-percentage lengths
  vw: { min: 0, max: 100, step: 1 },
  vh: { min: 0, max: 100, step: 1 },
  vi: { min: 0, max: 100, step: 1 },
  vb: { min: 0, max: 100, step: 1 },
  vmin: { min: 0, max: 100, step: 1 },
  vmax: { min: 0, max: 100, step: 1 },
  svw: { min: 0, max: 100, step: 1 },
  svh: { min: 0, max: 100, step: 1 },
  svi: { min: 0, max: 100, step: 1 },
  svb: { min: 0, max: 100, step: 1 },
  svmin: { min: 0, max: 100, step: 1 },
  svmax: { min: 0, max: 100, step: 1 },
  lvw: { min: 0, max: 100, step: 1 },
  lvh: { min: 0, max: 100, step: 1 },
  lvi: { min: 0, max: 100, step: 1 },
  lvb: { min: 0, max: 100, step: 1 },
  lvmin: { min: 0, max: 100, step: 1 },
  lvmax: { min: 0, max: 100, step: 1 },
  dvw: { min: 0, max: 100, step: 1 },
  dvh: { min: 0, max: 100, step: 1 },
  dvi: { min: 0, max: 100, step: 1 },
  dvb: { min: 0, max: 100, step: 1 },
  dvmin: { min: 0, max: 100, step: 1 },
  dvmax: { min: 0, max: 100, step: 1 },

  // Container query length units
  cqw: { min: 0, max: 100, step: 1 },
  cqh: { min: 0, max: 100, step: 1 },
  cqi: { min: 0, max: 100, step: 1 },
  cqb: { min: 0, max: 100, step: 1 },
  cqmin: { min: 0, max: 100, step: 1 },
  cqmax: { min: 0, max: 100, step: 1 },

  // Angle units
  deg: { min: 0, max: 360, step: 1 },
  grad: { min: 0, max: 400, step: 1 },
  rad: { min: 0, max: 6.28, step: 0.01 },
  turn: { min: 0, max: 1, step: 0.01 },

  // Time units
  s: { min: 0, max: 10, step: 0.1 },
  ms: { min: 0, max: 5000, step: 50 },

  // Frequency units
  Hz: { min: 0, max: 20000, step: 10 },
  kHz: { min: 0, max: 20, step: 0.1 },

  // Resolution units
  dpi: { min: 72, max: 600, step: 1 },
  dpcm: { min: 28, max: 236, step: 1 },
  dppx: { min: 1, max: 4, step: 0.1 },

  // Percentage
  "%": { min: 0, max: 100, step: 1 },

  // Grid
  fr: { min: 0, max: 10, step: 0.1 },
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
      config[propName] = {
        ...detected,
        scope: scope !== ":root" ? scope : undefined,
      };
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

  // Try to detect unit-less numeric values (e.g. 1 or 1.4)
  const unitlessMatch = value.match(/^(-?\d*\.?\d+)$/);
  if (unitlessMatch) {
    const currentValue = parseFloat(unitlessMatch[1]);

    const range = sliderRanges[""] || { min: 0, max: 5, step: 0.1 };
    const min = 0;
    const max =
      currentValue !== 0
        ? Math.ceil(Math.abs(currentValue) * 10)
        : range.max ?? 5;
    const step = range.step ?? 0.1;
    const defaultValue = Math.min(Math.max(currentValue, min), max);

    return {
      type: "slider",
      min,
      max,
      default: defaultValue,
      unit: "",
      step: step ?? 0.1,
    };
  }

  // Try to detect numeric value with unit
  const numericMatch = value.match(/^(-?\d*\.?\d+)\s*([a-z%]+)$/i);
  if (numericMatch) {
    const [, numStr, unit] = numericMatch;
    const currentValue = parseFloat(numStr);

    const range = sliderRanges[unit];
    if (range) {
      const min = 0;
      const max =
        currentValue !== 0 ? Math.ceil(Math.abs(currentValue) * 10) : range.max;
      const defaultValue = Math.min(Math.max(currentValue, min), max);

      return {
        type: "slider",
        min,
        max,
        default: defaultValue,
        unit: unit as CSSUnit,
        step: range.step,
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
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgrey",
    "darkgreen",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "grey",
    "green",
    "greenyellow",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgrey",
    "lightgreen",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",
    "transparent",
    "currentcolor",
  ];

  return namedColors.includes(value.toLowerCase());
}
