import { mdiClose, mdiContentSave } from "@mdi/js";
import { LitElement, html, css, unsafeCSS } from "lit";
import { ll_button, ll_textinput } from "./widget.js";
import { default as scrollbar } from "./css/scrollbar.js";
import { defaultNote } from "./store.js";

export class ll_new_note extends LitElement {
  static properties = { addition: {} };
  static styles = css`
    #title {
      width: 100%;
    }
    #editor {
      outline: none;
      width: calc(100% - 0.5rem);
      height: 100%;
      resize: none;
      flex: 1;
      overflow: auto;
      color: inherit;
      background: initial;
    }
    ${unsafeCSS(scrollbar("#editor"))}
    .addition {
      display: flex;
      white-space: nowrap;
      width: 100%;
      overflow: auto;
      overflow-y: hidden;
      color: #ccc;
    }
    .addition::-webkit-scrollbar {
      width: 4px;
    }
    .addition-item {
      display: inline;
      background: var(--ll-normal-color);
      width: fit-content;
      border-top-left-radius: 10px;
      padding-left: 4px;
      padding-right: 4px;
      color: inherit;
      border-top-right-radius: 10px;
      margin-right: 4px;
    }
    .addition-active {
      background: var(--ll-active-color);
    }
    .delete-icon {
      display: inline;
      position: relative;
      top: 2px;
      border-radius: 100%;
    }
    .delete-icon:hover {
      color: red;
    }
    @media only screen and (max-width: 600px) {
      #save{
        width:2rem;
        height:2rem;
      }
    }
  `;
  constructor() {
    super();
    var state = window.store.getState().ui;
    var defaultCurrent = {
      name: "",
      content: "",
      type: "markdown",
      tags: [],
      addition: {},
    };
    if (state.mode == "edit") {
      this.getNote();
    } else {
      this.current = defaultNote;
    }
  }
  getNote() {
    var state = window.store.getState();
    this.edit = true;
    this.name = state.ui.name;
    if (state.data.notes[state.ui.name]) {
      this.current = JSON.parse(
        JSON.stringify(state.data.notes[state.ui.name])
      );
    } else {
      this.current = defaultNote;
    }
    if (!this.current.tags) {
      this.current.tags = [];
    }
  }
  add() {
    var current = this.current;
    if (current.name === "" || current.content === "") {
      return;
    }
    if (this.edit && this.name != current.name) {
      window.store.dispatch({ type: "notes/del", name: this.name });
    }
    window.store.dispatch({ type: "notes/add", content: current });
    window.store.dispatch({ type: "ui/view", name: current.name });
  }
  sync(type) {
    if (this.addition != undefined) {
      var current = this.current.addition[this.addition];
    } else {
      var current = this.current;
    }
    switch (type) {
      case "title":
        var value = this.shadowRoot.getElementById("title").value;
        if (current.name != value) {
          if (this.addition != undefined) {
            if (
              Object.keys(this.current.addition).includes(value) &&
              this.current.addition[value] != current
            ) {
              this.shadowRoot.getElementById("title").reject = true;
              return;
            } else {
              this.shadowRoot.getElementById("title").reject = false;
            }

            delete this.current.addition[this.addition];
            this.current.addition[value] = current;
            this.addition = value;
          } else {
            var notes = window.store.getState().data.notes;
            if (Object.keys(notes).includes(value)) {
              this.shadowRoot.getElementById("title").reject = true;
              return;
            } else {
              this.shadowRoot.getElementById("title").reject = false;
            }
          }
        }
        current.name = value;
        break;
      case "content":
        current.content = this.shadowRoot.getElementById("editor").value;
        break;
      case "tags":
        current.tags = this.shadowRoot.getElementById("tags").value.split(" ");
        break;
    }
  }
  addAddition() {
    this.current.addition["New subnote"] = { name: "New subnote", content: "" };
    this.update();
  }
  deleteAddition(name) {
    this.addition = undefined;
    delete this.current.addition[name];
    this.update();
  }
  render() {
    if (window.store.getState().ui.name != this.current.name) {
      this.getNote();
    }
    if (this.addition == undefined) {
      var current = this.current;
    } else {
      var current = this.current.addition[this.addition] || this.current;
    }

    var addition = Object.keys(this.current.addition || {});
    addition.splice(0, 0, undefined);
    addition = addition.map((name) => {
      var active = "";
      if (name == this.addition) {
        active = "addition-active";
      }
      return html`<div
        @click=${() => {
          this.addition = name;
          this.update();
        }}
        class="addition-item ${active}"
      >
        ${name || (name == undefined && "Main note") || name}
        ${(name != undefined &&
          html` <div
            @click=${() => {
              this.deleteAddition(name);
              return false;
            }}
            class=" delete-icon "
          >
            <ll-icon path=${mdiClose}></ll-icon>
          </div>`) ||
        ""}
      </div>`;
    });

    this.updateComplete.then(() => {
      var title = this.shadowRoot.getElementById("title");
      title.value = current.name;
      title.update();
      this.shadowRoot.getElementById("editor").value = current.content;
    });
    return html`<div
        id="main"
        style="display: flex; flex-direction: column;height:100%"
      >
        <div style="display:flex">
          <ll-textinput
            placeholder="title"
            id="title"
            @input=${() => {
              this.sync("title");
            }}
          >
          </ll-textinput>
        </div>
        <div style="display:flex">
          <div class="addition">${addition}</div>
          <ll-button
            @click=${() => {
              this.addAddition();
            }}
            >Add</ll-button
          >
        </div>

        <textarea
          id="editor"
          @input=${() => {
            this.sync("content");
          }}
        >
${current.content}</textarea
        >
        <div style="display:flex">
          <ll-textinput
            @input=${() => {
              this.sync("tags");
            }}
            style="flex:1"
            id="tags"
            placeholder="Tags"
            value=${this.current.tags}
          ></ll-textinput
          ><ll-button id="save" @click=${this.add}
            ><ll-icon path=${mdiContentSave}></ll-icon
          ></ll-button>
        </div>
      </div>
      <div id="addition"></div>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
