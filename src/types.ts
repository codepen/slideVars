export type CSSUnit =
  // Absolute length units
  | "px"
  | "cm"
  | "mm"
  | "in"
  | "pt"
  | "pc"
  | "Q"
  // Font-relative length units
  | "em"
  | "rem"
  | "ex"
  | "rex"
  | "cap"
  | "rcap"
  | "ch"
  | "rch"
  | "ic"
  | "ric"
  | "lh"
  | "rlh"
  // Viewport-percentage lengths
  | "vw"
  | "vh"
  | "vi"
  | "vb"
  | "vmin"
  | "vmax"
  | "svw"
  | "svh"
  | "svi"
  | "svb"
  | "svmin"
  | "svmax"
  | "lvw"
  | "lvh"
  | "lvi"
  | "lvb"
  | "lvmin"
  | "lvmax"
  | "dvw"
  | "dvh"
  | "dvi"
  | "dvb"
  | "dvmin"
  | "dvmax"
  // Container query length units
  | "cqw"
  | "cqh"
  | "cqi"
  | "cqb"
  | "cqmin"
  | "cqmax"
  // Angle units
  | "deg"
  | "grad"
  | "rad"
  | "turn"
  // Time units
  | "s"
  | "ms"
  // Frequency units
  | "Hz"
  | "kHz"
  // Resolution units
  | "dpi"
  | "dpcm"
  | "dppx"
  // Percentage
  | "%"
  // Flex
  | "fr";

export interface SliderConfig {
  type: "slider";
  min: number;
  max: number;
  default?: number;
  unit: CSSUnit;
  scope?: string;
  step?: number;
}

export interface ColorConfig {
  type: "color";
  default?: string;
  scope?: string;
}

export type VarConfig = SliderConfig | ColorConfig;

export interface SlideVarsOptions {
  defaultOpen?: boolean;
  auto?: boolean; // Auto-detect CSS variables from :root
  scope?: string; // Selector to read CSS variables from (defaults to ":root")
}

export interface SlideVarsConfig {
  [varName: string]: VarConfig;
}

export interface AutoDetectDefaults {
  sliderRanges?: {
    [unit: string]: { min: number; max: number; step?: number };
  };
}
