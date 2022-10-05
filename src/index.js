import { LitElement, html, css } from "lit";
import localForage from "localforage";

import { store } from "./store.js";

import { ll_new_note } from "./new_view.js";
import { ll_notes_list } from "./notes_list.js";
import { ll_notes_view } from "./notes_view.js";
import { ll_icon } from "./icon.js";
import { ll_header } from "./header.js";
import { ll_settings } from "./settings.js";
export class ll_main extends LitElement {
  static styles = css`
    #content {
      --ll-left-size: 20%;
      --ll-header-height: 2vh;
      --ll-footer-height: 4vh;
      overflow: hidden;
    }
    .header {
      width: 100%;
      -webkit-user-select: none;
      -webkit-app-region: drag;
      height: var(--ll-header-height);
    }
    .footer {
      margin-top: 6px
      width: 100%;
      height: var(--ll-footer-height);
    }
    #left {
      float: left;
      width: var(--ll-left-size);
      height: 100vh;
      display: flex;
      flex-direction: column;
      border-right-style: solid;
      border-width: 1px;
    }
    #right {
      height: 100vh;
      margin-left: 1px;
      width: calc(100% - var(--ll-left-size));
    }
    #content-right {
      overflow: auto;
      height: calc( 100vh - (var(--ll-header-height) + 4%));  
    }
    #content-left {
      flex: 1;
      overflow: auto;
      height: 100%;
    }
    hr{width:100%}
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
    var leftContentOverride = undefined;
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
      case "settings":
        content = new ll_settings();
        content.role = "right";
        leftContentOverride = new ll_settings();
        content.role = "left";
        break;
      default:
        content = html``;
        break;
    }
    return html` <div id="content" style="display:flex">
      <div id="left">
        <div class="header">
          <ll-header
            role="left"
            backbuttom=${!!leftContentOverride}
          ></ll-header>
        </div>
        <hr />
        <div id="content-left">
          ${leftContentOverride || new ll_notes_list()}
        </div>
        <hr style="margin:0px;" />
        <div class="footer"><ll-header role="footer"></ll-header></div>
      </div>
      <div id="right">
        <div class="header"><ll-header role="right"></ll-header></div>
        <hr />

        <div id="content-right">${content}</div>
      </div>
    </div>`;
  }
}
customElements.define("ll-main", ll_main);
