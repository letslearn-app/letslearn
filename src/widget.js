import { LitElement, html, css } from "lit";

export class ll_button extends LitElement {
  static properties = {};
  static styles = css`
    button {
      border-color: #7a7a7a;
      background: initial;
      border-radius: 4px;
      padding-top: 2px;
      padding-bottom: 0px;
      padding-left: 4px;
      padding-right: 4px;
      color: inherit;
      border-style: solid;
      border-width: 1px;
      outline: none;
    }
    button:active {
      filter: invert(0.5);
    }
  `;
  constructor() {
    super();
  }
  render() {
    return html`<button><slot></slot></button>`;
  }
}

export class ll_textinput extends LitElement {
  static properties = { value: {}, placeholder: {} };
  static styles = css`
    #input {
      width: 100%;
      background: initial;
      color: inherit;
      border-style: solid;
      border-width: 1px;
      outline: none;
    }
  `;
  constructor() {
    super();
    this.value=""
  }
  updateValue() {
    this.value = this.shadowRoot.getElementById("input").value;
  }
  render() {
    this.updateComplete.then(()=>{this.shadowRoot.getElementById("input").value=this.value})
    return html`<div style="display:flex;height:100%;"><input id=input placeholder=${this.placeholder} @input=${this.updateValue}></input></div>`;
  }
}

customElements.define("ll-button", ll_button);
customElements.define("ll-textinput", ll_textinput);
