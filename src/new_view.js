import { mdiContentSave } from "@mdi/js";
import { LitElement, html, css } from "lit";
import { ll_button, ll_textinput } from "./widget.js";
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
    .addition-item {
      display: inline;
      background: #444444;
      width: fit-content;
      border-top-left-radius: 10px;
      padding-left: 4px;
      padding-right: 4px;
      color: #ccc;
      border-top-right-radius: 10px;
      margin-right: 4px;
    }
  `;
  constructor() {
    super();
    var state = window.store.getState().ui;
    var defaultCurrent = { name: "", content: "", tags: [], addition: {} };
    if (state.mode == "edit") {
      this.edit = true;
        this.name = state.name;
        this.current =
        window.store.getState().data.notes[state.name] || defaultCurrent;
      if (!this.current.tags) {
        this.current.tags = [];
      }
    } else {
      this.current = defaultCurrent;
      console.log(defaultCurrent)
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
        if (current.name != value && this.addition != undefined) {
          delete this.current.addition[this.addition];
          this.current.addition[value] = current;
          this.addition = value;
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
    this.current.addition["New subnote"] = { name: "New subnote", content: '' };
    this.update();
  }
  render() {
    if (this.addition == undefined) {
      var current = this.current;
    } else {
      var current = this.current.addition[this.addition];
    }
    var addition = Object.keys(this.current.addition);
    addition.splice(0, 0, undefined);
    addition = addition.map((name) => {
      return html`<div
        @click=${() => {
          this.addition = name;this.update()
        }}
        class="addition-item"
      >
        ${name||name==undefined&&"Main note"||name}
      </div>`;
    });

    this.updateComplete.then(()=>{
      var title=this.shadowRoot.getElementById("title")
      title.value=current.name
      title.update()
      this.shadowRoot.getElementById("editor").value=current.content
    })   
    return html`<div
        id="main"
        style="display: flex; flex-direction: column;height:100%"
      >
        <div style="display:flex">
                  <ll-textinput
          placeholder="title"
          id="title"
          @input=${()=>{this.sync("title")}}
        >
        </ll-textinput>   
        </div>
        <div style="display:flex;">
          <div style="width:100%">${addition}</div>
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
${current.content}</textarea>
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
          ><ll-button stype="width:2rem" @click=${this.add}
            ><ll-icon path=${mdiContentSave}></ll-icon
          ></ll-button>
        </div>
      </div>
      <div id="addition"></div>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
