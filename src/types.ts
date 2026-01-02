export type CSSUnit =
  | "px"
  | "rem"
  | "em"
  | "vw"
  | "vh"
  | "dvi"
  | "%"
  | "ch"
  | "ex";

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
