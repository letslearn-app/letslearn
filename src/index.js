import { LitElement, html, css } from "lit";
import localForage from "localforage";

import { store } from "./store.js";

import { ll_new_note } from "./new_view.js";
import { ll_notes_list } from "./notes_list.js";
import { ll_notes_view } from "./notes_view.js";
export class ll_main extends LitElement {
  static styles = css`
    #content {
      --ll-left-size: 20%;
    }
    #left {
      overflow: auto;
      float: left;
      width: var(--ll-left-size);
      height: 100vh;
      border-right-style: solid;
      border-width: 1px;
    }
    #right {
      overflow: auto;
      height: 100vh;
      margin-left: 1px;
      width: calc(100% - var(--ll-left-size));
    }
  `;
  constructor() {
    super();
    window.store = store;
    this.loadData();
    store.subscribeDataChange(this.syncData.bind(this));
    store.subscribeUiChange(this.update.bind(this));
    this.view = undefined;
  }

  loadData() {
    localForage.getItem("data").then((data) => {
      if (data == undefined) {
        return;
      }
      try {
        data = JSON.parse(data);
      } catch (err) {
        console.log("Data error");
        return;
      }
      store.dispatch({ type: "state/set", state: data });
    });
  }
  syncData(state) {
    delete state.__JUST_LOADED;
    localForage.setItem("data", JSON.stringify(state));
  }
  render() {
    var uiState = store.getState().ui;
    var content = undefined;
    switch (uiState.mode) {
      case "view":
        content = new ll_notes_view();
        content.name = uiState.name;
        break;
      case "new":
        content = new ll_new_note();
        break;
      case "edit":
        content = new ll_new_note();
        content.name = uiState.name;
        content.edit = true;
        break;
      default:
        content = html``;
        break;
    }
    return html`<div id="content" style="display:flex">
      <div id="left">${new ll_notes_list()}</div>
      <div id="right">
        ${content}
        <div></div>
      </div>
    </div>`;
  }
}
customElements.define("ll-main", ll_main);
