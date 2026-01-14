import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { SlideVarsConfig, SliderConfig, ColorConfig } from "./types";
import styles from "./component.css?inline";
import "./logo";

@customElement("slide-vars")
export class SlideVarsElement extends LitElement {
  @property({ type: Object })
  config: SlideVarsConfig = {};

  @state()
  private isOpen: boolean = false;

  @state()
  private values: Map<string, string> = new Map();

  @state()
  private colorInputLoaded: boolean = false;

  static styles = css`
    ${unsafeCSS(styles)}
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadColorInputComponent();
  }

  private loadColorInputComponent() {
    // Check if color-input is already defined
    if (customElements.get("color-input")) {
      this.colorInputLoaded = true;
      return;
    }

    // Load the color-input web component from CDN as ES module
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://esm.sh/hdr-color-input";
    script.onload = () => {
      this.colorInputLoaded = true;
      this.requestUpdate();
    };
    script.onerror = (err) => {
      console.warn("Failed to load color-input component:", err);
    };
    document.head.appendChild(script);
  }

  setConfig(config: SlideVarsConfig, defaultOpen: boolean = false) {
    this.config = config;
    this.isOpen = defaultOpen;
    this.initializeValues();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  private initializeValues() {
    Object.entries(this.config).forEach(([varName, varConfig]) => {
      if (varConfig.type === "slider") {
        const defaultValue =
          varConfig.default !== undefined
            ? varConfig.default
            : (varConfig.min + varConfig.max) / 2;
        const value = `${defaultValue}${varConfig.unit}`;
        this.values.set(varName, value);
        this.setCSSVariable(varName, value, varConfig.scope);
      } else if (varConfig.type === "color") {
        // For modern colors, use the value as-is; for standard colors, provide a hex fallback
        const value =
          varConfig.default ||
          (varConfig.colorSpace === "modern"
            ? "oklch(75% 0.1 180)"
            : "#ff0000");
        this.values.set(varName, value);
        this.setCSSVariable(varName, value, varConfig.scope);
      }
    });
  }

  private handleSliderChange(
    varName: string,
    config: SliderConfig,
    event: Event
  ) {
    const input = event.target as HTMLInputElement;
    const value = `${input.value}${config.unit}`;
    this.values.set(varName, value);
    this.setCSSVariable(varName, value, config.scope);
    this.requestUpdate();
  }

  private handleColorChange(
    varName: string,
    config: ColorConfig,
    event: Event
  ) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.values.set(varName, value);
    this.setCSSVariable(varName, value, config.scope);
    this.requestUpdate();
  }

  private handleModernColorChange(
    varName: string,
    config: ColorConfig,
    event: Event
  ) {
    const customEvent = event as CustomEvent;
    const value = customEvent.detail?.value || (event.target as any).value;
    this.values.set(varName, value);
    this.setCSSVariable(varName, value, config.scope);
    this.requestUpdate();
  }

  private setCSSVariable(varName: string, value: string, scope?: string) {
    const targetElement = scope
      ? document.querySelector(scope)
      : document.documentElement;

    if (targetElement) {
      (targetElement as HTMLElement).style.setProperty(varName, value);
    }
  }

  private normalizeColor(color: string): string {
    // Convert named colors or other formats to hex
    const tempDiv = document.createElement("div");
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // Convert rgb to hex
    const rgb = computedColor.match(/\d+/g);
    if (rgb) {
      const hex =
        "#" +
        rgb
          .map((x) => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
          })
          .join("");
      return hex;
    }

    return color;
  }

  private renderControl(
    varName: string,
    varConfig: SliderConfig | ColorConfig
  ) {
    const currentValue = this.values.get(varName) || "";

    if (varConfig.type === "slider") {
      const defaultValue =
        varConfig.default !== undefined
          ? varConfig.default
          : (varConfig.min + varConfig.max) / 2;

      return html`
        <div class="control-group">
          <div class="control-header">
            <label class="var-name">${varName}</label>
            <span class="current-value">${currentValue}</span>
          </div>
          <input
            type="range"
            min="${varConfig.min}"
            max="${varConfig.max}"
            step="${varConfig.step || 1}"
            .value="${defaultValue.toString()}"
            @input="${(e: Event) =>
              this.handleSliderChange(varName, varConfig, e)}"
          />
        </div>
      `;
    } else if (varConfig.type === "color") {
      // Use <color-input> for modern color spaces (oklch, lab, etc.)
      if (varConfig.colorSpace === "modern" && this.colorInputLoaded) {
        return html`
          <div class="control-group">
            <div class="control-header">
              <label class="var-name">${varName}</label>
              <span class="current-value">${currentValue}</span>
            </div>
            <color-input
              class="modern-color-picker"
              value="${varConfig.default || "oklch(75% 0.1 180)"}"
              @change="${(e: Event) =>
                this.handleModernColorChange(varName, varConfig, e)}"
            ></color-input>
          </div>
        `;
      }

      // Fall back to native color picker for standard colors
      const defaultValue = this.normalizeColor(varConfig.default || "#ff0000");

      return html`
        <div class="control-group">
          <div class="control-header">
            <label class="var-name">${varName}</label>
            <span class="current-value">${currentValue}</span>
          </div>
          <input
            type="color"
            .value="${defaultValue}"
            @input="${(e: Event) =>
              this.handleColorChange(varName, varConfig, e)}"
          />
        </div>
      `;
    }

    return null;
  }

  render() {
    const hasVariables = Object.keys(this.config).length > 0;

    return html`
      <button
        class="toggle-button"
        aria-label="Toggle CSS variable controls"
        @click="${this.toggle}"
      >
        <slidevars-logo .open="${this.isOpen}"></slidevars-logo>
      </button>

      <div class="controls-panel ${this.isOpen ? "open" : ""}">
        <div class="controls">
          <slot></slot>
          ${hasVariables
            ? Object.entries(this.config).map(([varName, varConfig]) =>
                this.renderControl(varName, varConfig)
              )
            : html`<p class="no-variables-warning">
                No CSS custom properties detected.
              </p>`}
        </div>
      </div>
    `;
  }
}

// Type augmentation for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    "slide-vars": SlideVarsElement;
  }
}
