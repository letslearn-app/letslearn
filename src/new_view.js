import { LitElement, html, css } from "lit";

export class ll_new_note extends LitElement {
  static properties = { edit: {}, name: {} };
  static styles = css`
    #title {
      width: calc(100% - 1rem);
    }
    #editor {
      width: calc(100% - 1rem);
      height: calc(100% - 4.6rem);
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
    var name=""
    var tags=""
    if (this.edit) {
      content = window.store.getState().data.notes[this.name].content;
      name = window.store.getState().data.notes[this.name].name;
      tags =window.store.getState().data.notes[this.name].tags.join(" ");
    }

    return html`<div style="display: flex; flex-direction: column;height:100%"><input value=${
      (this.edit && name) || ""
    } placeholder=title id=title ></br><textarea id=editor>${content}</textarea><div style="display:flex"><input style="flex:1" id=tags placeholder=Tags value=${(this.edit&&tags)}></input><button stype="width:2rem" @click=${
      this.add
    }><ll-icon name=mdiContentSave></ll-icon></button></div>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
