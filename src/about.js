import { LitElement, html, css} from "lit";

export class ll_about extends LitElement{
  constructor(){
  super();
  }
  render(){
    return html`<div>
      <h1 align=center>Letslearn</h1>
      </div>`
  }
}

customElements.define("ll-about",ll_about)

