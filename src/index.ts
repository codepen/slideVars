import "./component";
import "./logo";
import { SlideVarsElement } from "./component";
import { SlideVarsLogo } from "./logo";
import { autoDetectVariables } from "./autoDetect";
import type {
  SlideVarsConfig,
  SlideVarsConfigGroup,
  SlideVarsInitConfig,
  SlideVarsOptions,
  SlideVarsRenderSection,
  VarConfig,
} from "./types";

export * from "./types";
export { SlideVarsElement, SlideVarsLogo };

function isVarConfig(value: unknown): value is VarConfig {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { type?: unknown };
  return candidate.type === "slider" || candidate.type === "color";
}

function isConfigGroup(value: unknown): value is SlideVarsConfigGroup {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    return false;
  }

  return entries.every(
    ([varName, varConfig]) => varName.startsWith("--") && isVarConfig(varConfig)
  );
}

function normalizeManualConfig(config: SlideVarsInitConfig): {
  flatConfig: SlideVarsConfig;
  renderSections: SlideVarsRenderSection[];
} {
  const flatConfig: SlideVarsConfig = {};
  const renderSections: SlideVarsRenderSection[] = [];

  Object.entries(config).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      if (isVarConfig(value)) {
        flatConfig[key] = value;
        renderSections.push({ type: "var", varName: key });
      }
      return;
    }

    if (!isConfigGroup(value)) {
      return;
    }

    const varNames = Object.keys(value);
    varNames.forEach((varName) => {
      flatConfig[varName] = value[varName];
    });

    renderSections.push({ type: "group", groupName: key, varNames });
  });

  return { flatConfig, renderSections };
}

class SlideVars {
  private element: SlideVarsElement | null = null;

  /**
   * Initialize the slide vars component with configuration
   * @param config - Configuration object mapping CSS variable names to their controls.
   *                 Pass an empty object {} or omit to auto-detect from :root
   * @param options - Optional configuration for the component behavior
   */
  init(config: SlideVarsInitConfig = {}, options: SlideVarsOptions = {}): void {
    // Remove existing managed element if it exists and we created it
    if (
      this.element &&
      this.element.parentNode &&
      !this.element.hasAttribute("data-manual")
    ) {
      this.element.parentNode.removeChild(this.element);
    }

    const { flatConfig: manualConfig, renderSections: manualRenderSections } =
      normalizeManualConfig(config);
    let renderSections = manualRenderSections;

    // Auto-detect if enabled or if config is empty
    let finalConfig = manualConfig;
    if (options.auto || Object.keys(manualConfig).length === 0) {
      const autoConfig = autoDetectVariables(options.scope, undefined, options);
      // Merge auto-detected with manual config (manual config takes precedence)
      finalConfig = { ...autoConfig, ...manualConfig };

      const autoRenderSections: SlideVarsRenderSection[] = Object.keys(
        autoConfig
      )
        .filter((varName) => !(varName in manualConfig))
        .map((varName) => ({ type: "var", varName }));

      renderSections = [...autoRenderSections, ...manualRenderSections];
    }

    // Check if user has manually placed a <slide-vars> element in their HTML
    const existingElement = document.querySelector(
      "slide-vars"
    ) as SlideVarsElement | null;

    if (existingElement) {
      // Use the existing element (preserves slotted content)
      this.element = existingElement;
      this.element.setAttribute("data-manual", "true");
      this.element.setConfig(
        finalConfig,
        options.defaultOpen ?? false,
        renderSections
      );
    } else {
      // Create and inject the custom element
      this.element = new SlideVarsElement();
      this.element.setConfig(
        finalConfig,
        options.defaultOpen ?? false,
        renderSections
      );

      // Wait for DOM to be ready
      if (document.body) {
        document.body.appendChild(this.element);
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          if (this.element) {
            document.body.appendChild(this.element);
          }
        });
      }
    }
  }

  /**
   * Remove the slide vars component from the DOM
   */
  destroy(): void {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }

  /**
   * Get the current slide vars element
   */
  getElement(): SlideVarsElement | null {
    return this.element;
  }

  /**
   * Open the controls panel
   */
  open(): void {
    if (this.element) {
      this.element.open();
    }
  }

  /**
   * Close the controls panel
   */
  close(): void {
    if (this.element) {
      this.element.close();
    }
  }

  /**
   * Toggle the controls panel
   */
  toggle(): void {
    if (this.element) {
      this.element.toggle();
    }
  }
}

// Export a singleton instance
export const slideVars = new SlideVars();

// Also export the class for advanced usage
export { SlideVars };
