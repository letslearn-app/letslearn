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
    if (name === "" || content === "") {
      return;
    }
    if (this.edit && this.name != name) {
      window.store.dispatch({ type: "notes/del", name: this.name });
    }
    window.store.dispatch({ type: "notes/add", content, name });
    window.store.dispatch({ type: "ui/view", name });
  }
  render() {
    var content = "";
    if (this.edit) {
      content = window.store.getState().data.notes[this.name].content;
      name = window.store.getState().data.notes[this.name].name;
    }

    return html`<input value=${
      (this.edit && name) || ""
    } placeholder=title id=title ></br><textarea id=editor>${content}</textarea><button @click=${
      this.add
    }><ll-icon name=mdiContentSave></ll-icon></button>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
