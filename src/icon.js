import { LitElement, css, html } from "lit";

export class ll_icon extends LitElement {
  static properties = { path: {} };
  static styles = css`
    :host {
      display: inline;
    }
  `;
  render() {
    return html`<svg style="width:1rem;height:1rem" viewBox="0 0 24 24">
      <path fill="currentColor" d=${this.path} />
    </svg>`;
  }
}

customElements.define("ll-icon", ll_icon);
