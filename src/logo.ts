import { LitElement, html, css, svg } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("slidevars-logo")
export class SlideVarsLogo extends LitElement {
  @property({ type: Boolean })
  open = false;

  @property({ type: Number })
  size = 24;

  static styles = css`
    :host {
      display: inline-block;
      width: var(--logo-size, 24px);
      height: var(--logo-size, 24px);
    }

    svg {
      width: 100%;
      height: 100%;
    }

    .slider-line {
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .slider-knob {
      fill: currentColor;
      transition: cx 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;

  render() {
    // When closed: staggered positions (25%, 50%, 75%)
    // When open: more varied positions (15%, 65%, 85%)
    const knob1X = this.open ? "15%" : "25%";
    const knob2X = this.open ? "65%" : "50%";
    const knob3X = this.open ? "85%" : "75%";

    return html`
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="SlideVars logo"
      >
        <!-- Top slider -->
        <line class="slider-line" x1="2" y1="5" x2="22" y2="5" />
        <circle class="slider-knob" cx="${knob1X}" cy="5" r="3" />

        <!-- Middle slider -->
        <line class="slider-line" x1="2" y1="12" x2="22" y2="12" />
        <circle class="slider-knob" cx="${knob2X}" cy="12" r="3" />

        <!-- Bottom slider -->
        <line class="slider-line" x1="2" y1="19" x2="22" y2="19" />
        <circle class="slider-knob" cx="${knob3X}" cy="19" r="3" />
      </svg>
    `;
  }
}

// Type augmentation for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    "slidevars-logo": SlideVarsLogo;
  }
}
