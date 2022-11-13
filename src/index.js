import { LitElement, html, css, unsafeCSS } from "lit";
import localForage from "localforage";

import { store } from "./store.js";

import { ll_new_note } from "./new_view.js";
import { ll_notes_list } from "./notes_list.js";
import { ll_notes_view } from "./notes_view.js";
import { ll_icon } from "./icon.js";
import { ll_header } from "./header.js";
import { ll_settings } from "./settings.js";
import { ll_about } from "./about.js";

import { default as ll_main_css } from "./css/index.css";
import { default as ll_body_css } from "./css/common.js";

window.letslearn = { flags: {} };

// Set the flags
window.letslearn.flags.serviceWorker = true;

if (navigator.userAgent.indexOf("Electron/") > 1) {
  window.letslearn.flags.hasWinbuttoms = true;
  window.letslearn.flags.handleLinksByElectron = true;
  window.letslearn.flags.serviceWorker = false;
  window.letslearn.flags.requireElectron = true;
}

// Require Electron module
if (window.letslearn.flags.requireElectron) {
  window.electron = window.require("electron");
}

// Handle links by electron
if (window.letslearn.flags.handleLinksByElectron) {
  window.addEventListener("click", (ev) => {
    for (var i of ev.path) {
      if (i.tagName == "A") {
        if (
          i.href != "" &&
          !(i.href.startsWith("#") || i.href.startsWith("blob"))
        ) {
          ev.preventDefault();
          console.log(i.href);
          electron.shell.openExternal(i.href);
        }
      }
    }
  });
}

// ServiceWorker
if ("serviceWorker" in navigator && window.letslearn.flags.serviceWorker) {
  navigator.serviceWorker.register("./sw.js").then(() => {
    console.log("Service Worker Registered");
  });
}

// Inject style
var styleElement = document.createElement("style");
styleElement.innerHTML = ll_body_css;
document.getElementsByTagName("head")[0].appendChild(styleElement);



// Main class
export class ll_main extends LitElement {
  static styles = css([ll_main_css]);
  constructor() {
    super();
    window.store = store;
    this.loadData();
    store.subscribeDataChange(this.syncData.bind(this));
    store.subscribeUiChange(this.update.bind(this));
    this.content = undefined;
    this.contentName= undefined

    window.onbeforeunload = () => {
      localStorage.setItem("uiStatus", JSON.stringify(store.getState().ui));
    };
    var uiStatus = localStorage.getItem("uiStatus");
    if (uiStatus && uiStatus != "{}") {
      store.getState().ui = JSON.parse(uiStatus);
      localStorage.removeItem("uiStatus");
    }
    //Init darkmode
    this.initDarkmode()
    window.matchMedia('(prefers-color-scheme: dark)').onchange=()=>{
      var darkmode=window.matchMedia('(prefers-color-scheme: dark)').matches;  
      window.store.dispatch({type:"ui/darkmode",darkmode})
    }
  }
  initDarkmode(){
    var darkmode=window.matchMedia('(prefers-color-scheme: dark)').matches;
    window.store.getState().ui.darkmode=darkmode
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
    var leftContentOverride = undefined;

    if (uiState.darkmode){
      document.getElementsByTagName("body")[0].className="darkmode"                
    }
    else{
      document.getElementsByTagName("body")[0].className=""
    }
    if (this.contentName==uiState.mode){
      if (uiState &&uiState.name){
        this.content.name=uiState.name
      }
      this.content.update()
    }
    else{
    var content=undefined
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
      case "about":
        content = new ll_about();
        leftContentOverride = html``;
        break;
      default:
        content = html``;
        break;
    }
    this.content=content
    this.contentName=uiState.mode
    }
    return html` <div id="content" style="display:flex">
      <div id="left-box">
        <div id="left">
          <div class="header">
            <ll-header
              role="left"
              backbuttom=${uiState.mode != undefined}
            ></ll-header>
          </div>
          <div id="content-left" class="content">
            ${leftContentOverride || new ll_notes_list()}
          </div>
          <hr style="margin:0px;" />
          <div class="footer"><ll-header role="footer"></ll-header></div>
        </div>
      </div>
      <div style="border-left: solid;border-left-width: 1px;"></div>
      <div id="right">
        <div class="header"><ll-header role="right"></ll-header></div>
        <div class="content" id="content-right">${this.content}</div>
      </div>
    </div>`;
  }
}
customElements.define("ll-main", ll_main);
