import { LitElement, css, html } from "lit";
import * as mdi from "@mdi/js";

export class ll_icon extends LitElement {
  static properties = { name: {} };
  static styles = css`
    :host {
      display: inline;
    }
  `;
  render() {
    return html`<svg style="width:1rem;height:1rem" viewBox="0 0 24 24">
      <path fill="currentColor" d=${mdi[this.name]} />
    </svg>`;
  }
}

customElements.define("ll-icon", ll_icon);
