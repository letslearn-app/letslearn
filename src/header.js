import { LitElement, html, css } from "lit";

export class ll_header extends LitElement {
  static properties = { role: {}, backbuttom: {} };
  static styles = css`
    .buttoms {
      -webkit-app-region: no-drag;
    }
    .win-buttoms {
      padding-top: 3px;
    }
    .win-buttoms:hover {
      background: #ff004d;
    }
  `;
  constructor() {
    super();
    store.subscribeUiChange(this.update.bind(this));
  }
  render() {
    if (this.role == "right") {
      var winButtoms = html`&nbsp`;
      if (window.isElectron) {
        winButtoms = html`<ll-icon
          class="buttoms win-buttoms"
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
          <div class="buttoms" style="text-align: right;">${winButtoms}</div>
        </div>`;
      }
      return html`<div style="text-align:right">${winButtoms}</div>`;
    }
    if (this.role == "left") {
      return html`<div style="display:flex;justify-content: space-between;">${
        (this.backbuttom == "true" &&
          html`
            <ll-icon
              class="buttoms"
              name="mdiArrowLeft"
              @click=${() => {
                window.store.dispatch({ type: "ui/norm" });
              }}
            ></ll-icon>
          `) ||
        html`<div></div>`
      }<div style="text-align:center">Letslearn</div>  <div></div></div>`;
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
