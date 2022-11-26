import { LitElement, html, css } from "lit";
import { default as appConfig } from "./appConfig.js";
var eruda=`javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();`
export class ll_about extends LitElement {
  constructor() {
    super();
  }
  render() {
    var gitId = appConfig.gitId || "";
    return html`<div>
      <h1 align="center">${appConfig.appName}</h1>
      <p align="center">${appConfig.appVerision}-${gitId}</p>
    </div>
    <hr>
     <h3>Developer options</h3>
     <a href=${eruda}>Enable Eruda</a>
     
    `;
  }
}

customElements.define("ll-about", ll_about);
