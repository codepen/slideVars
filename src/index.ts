import "./component";
import "./logo";
import { SlideVarsElement } from "./component";
import { SlideVarsLogo } from "./logo";
import { autoDetectVariables } from "./autoDetect";
import type { SlideVarsConfig, SlideVarsOptions } from "./types";

export * from "./types";
export { SlideVarsElement, SlideVarsLogo };

class SlideVars {
  private element: SlideVarsElement | null = null;

  /**
   * Initialize the slide vars component with configuration
   * @param config - Configuration object mapping CSS variable names to their controls.
   *                 Pass an empty object {} or omit to auto-detect from :root
   * @param options - Optional configuration for the component behavior
   */
  init(config: SlideVarsConfig = {}, options: SlideVarsOptions = {}): void {
    // Remove existing managed element if it exists and we created it
    if (
      this.element &&
      this.element.parentNode &&
      !this.element.hasAttribute("data-manual")
    ) {
      this.element.parentNode.removeChild(this.element);
    }

    // Auto-detect if enabled or if config is empty
    let finalConfig = config;
    if (options.auto || Object.keys(config).length === 0) {
      const autoConfig = autoDetectVariables(options.scope);
      // Merge auto-detected with manual config (manual config takes precedence)
      finalConfig = { ...autoConfig, ...config };
    }

    // Check if user has manually placed a <slide-vars> element in their HTML
    const existingElement = document.querySelector(
      "slide-vars"
    ) as SlideVarsElement | null;

    if (existingElement) {
      // Use the existing element (preserves slotted content)
      this.element = existingElement;
      this.element.setAttribute("data-manual", "true");
      this.element.setConfig(finalConfig, options.defaultOpen ?? false);
    } else {
      // Create and inject the custom element
      this.element = new SlideVarsElement();
      this.element.setConfig(finalConfig, options.defaultOpen ?? false);

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
