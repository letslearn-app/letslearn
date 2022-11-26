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
export class ll_selectbutton extends LitElement {
  static properties = {
    select: {},
    click: {},
    button: {},
    options: {},
    value: {},
  };
  static styles = css`
    #cont {
      width: fit-content;
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
    #cont:active {
      filter: invert(0.5);
    }
    button {
      color: inherit;
      background: none;
      border: none;
    }
    button:active {
    }
    select:active {
    }
    select {
      color: inherit;
      border: none;
      background: none;
    }
  `;
  constructor(args) {
    super();
    this.select = args.select;
    this.click = args.click;
    this.button = args.button;
    this.options = args.options;
    this.value = undefined;
  }
  onchange() {
    if (this.select instanceof Function) {
      var value = this.shadowRoot.getElementById("select").value;
      this.select(value);
    }
  }
  render() {
    this.updateComplete.then(() => {
      this.shadowRoot.getElementById("select").value = this.value;
    });
    var options = [];
    for (var i in this.options) {
      options.push(html`<option value=${i}>${this.options[i]}</option>`);
    }
    return html`
      <div id="cont">
        <button @click=${this.click}>${this.button}</button
        ><select @change=${this.onchange} id="select">
          ${options}
        </select>
      </div>
    `;
  }
}
export class ll_textinput extends LitElement {
  static properties = { value: {}, placeholder: {}, reject: {} };
  static styles = css`
    #input {
      width: 100%;
      background: initial;
      color: inherit;
      border-style: solid;
      border-width: 1px;
      outline: none;
    }
    .reject {
      border-color: red;
    }
  `;
  constructor() {
    super();
    this.value = "";
  }
  updateValue() {
    this.value = this.shadowRoot.getElementById("input").value;
  }
  render() {
    var classes = "";
    if (this.reject) {
      classes = "reject";
    }
    this.updateComplete.then(() => {
      this.shadowRoot.getElementById("input").value = this.value;
    });
    return html`<div style="display:flex;height:100%;"><input id=input  class=${classes} placeholder=${this.placeholder} @input=${this.updateValue}></input></div>`;
  }
}

customElements.define("ll-button", ll_button);
customElements.define("ll-textinput", ll_textinput);
customElements.define("ll-selectbutton", ll_selectbutton);
