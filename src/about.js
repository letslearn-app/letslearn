import { LitElement, html, css} from "lit";
import {default as appConfig} from './appConfig.js'
export class ll_about extends LitElement{
  constructor(){
  super();
  }
  render(){
    var gitId=appConfig.gitId||""
    return html`<div>
      <h1 align=center>${appConfig.appName}</h1>
      <p align=center>${appConfig.appVerision}-${gitId}</p>
      </div>`
  }
}

customElements.define("ll-about",ll_about)

