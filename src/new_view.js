import { LitElement, html, css } from "lit";
import { ll_button, ll_textinput } from "./widget.js";
export class ll_new_note extends LitElement {
  static properties = { edit: {}, name: {} };
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
  `;
  constructor() {
    super();
  }
  add() {
    var name = this.shadowRoot.getElementById("title").value;
    var content = this.shadowRoot.getElementById("editor").value;
    var tags = this.shadowRoot.getElementById("tags").value.split(" ");
    if (name === "" || content === "") {
      return;
    }
    if (this.edit && this.name != name) {
      window.store.dispatch({ type: "notes/del", name: this.name });
    }
    window.store.dispatch({ type: "notes/add", content, name, tags });
    window.store.dispatch({ type: "ui/view", name });
  }
  render() {
    var content = "";
    var name = "";
    var tags = "";
    if (this.edit) {
      content = window.store.getState().data.notes[this.name].content;
      name = window.store.getState().data.notes[this.name].name;
      tags = window.store.getState().data.notes[this.name].tags.join(" ");
    }

    return html`<div style="display: flex; flex-direction: column;height:100%">
      <ll-textinput
        value=${(this.edit && name) || ""}
        placeholder="title"
        id="title"
      ></ll-textinput
      ><textarea id="editor">${content}</textarea>
      <div style="display:flex">
        <ll-textinput
          style="flex:1"
          id="tags"
          placeholder="Tags"
          value=${this.edit && tags}
        ></ll-textinput
        ><ll-button stype="width:2rem" @click=${this.add}
          ><ll-icon name="mdiContentSave"></ll-icon
        ></ll-button>
      </div>
    </div>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
