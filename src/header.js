import { LitElement, html, css } from "lit";

export class ll_header extends LitElement {
  static properties = { role: {}, backbuttom: {} };
  static styles=css`#buttoms{-webkit-app-region: no-drag;}`
  constructor() {
    super();
    store.subscribeUiChange(this.update.bind(this));
  }
  render() {
    if (this.role == "right") {
      var winButtoms = html`&nbsp`;
      if (window.isElectron) {
        winButtoms = html`<ll-icon
          id=buttoms
          name="mdiClose"
          @click=${() => {
            window.close();
          }}
        ></ll-icon>`;
      }
      var uiState = window.store.getState().ui;
      if (uiState.mode == "view") {
        return html`<div style="display:flex;justify-content: space-between;">
          <div></div>
          <div style="text-align:center">${uiState.name}</div>
          <div id=buttoms style="text-align: right;">${winButtoms}</div>
        </div>`;
      }
      return html`<div style="text-align:right">${winButtoms}</div>`;
    }
    if (this.role == "left") {
      return html`${(this.backbuttom == "true" &&
        html`<ll-icon
          name="mdiArrowLeft"
          @click=${() => {
            window.store.dispatch({ type: "ui/norm" });
          }}
        ></ll-icon>`) ||
      ""}Letslearn`;
    }
    if (this.role == "footer") {
      return html`<ll-icon
        name="mdiCogOutline"
        @click=${() => {
          window.store.dispatch({ type: "ui/settings" });
        }}
      ></ll-icon>`;
    }
    return html`<div>&nbsp</div>`;
  }
}
customElements.define("ll-header", ll_header);
