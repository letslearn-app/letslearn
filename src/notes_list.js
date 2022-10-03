import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";

export class ll_notes_list extends LitElement {
  static properties = { searchRes: {} };
  static styles = css`
    a {
       color: inherit;
      text-decoration:none;
    }
    h3{margin-bottom:1px}
    .title-link {
       text-decoration:underline;
  `;
  constructor() {
    super();
    window.store.subscribe(this.update.bind(this));
  }
  search() {
    var res = [];
    var value =  this.shadowRoot.getElementById("search").value;
    var state = window.store.getState().data;
    for (var i in state.notes) {
      if (i.indexOf(value) > -1) {
        res.push(i);
      }
    }
    if (!res) {
      return;
    }
    this.searchRes = res;
  }
  viewNote(name) {
    window.store.dispatch({ type: "ui/view", name: name });
  }
  editNote(name) {
    window.store.dispatch({ type: "ui/edit", name: name });
  }
  delNote(name) {
    window.store.dispatch({ type: "notes/del", name: name });
  }
  render() {
    if (this.searchRes) {
      var notes = {};
      var notesCont = window.store.getState().data.notes;
      for (var i of this.searchRes) {
        notes[i] = notesCont[i];
      }
    } else {
      var notes = window.store.getState().data.notes;
    }
    var notesHtml = [];
    for (var i in notes) {
      var content = notes[i].content;
      content = marked.parse(content);
      content = content.replace(/<[^<>]+>/g, "");
      content = content.replace("&nbsp", "");
      if (content.length > 50) {
        content = content.slice(0, 50) + "...";
      }
      var viewFunc = Function(`this.viewNote("${i}")`).bind(this); //Very ugly but work
      var editFunc = Function(`this.editNote("${i}")`).bind(this);
      var delFunc = Function(`this.delNote("${i}")`).bind(this);
      notesHtml.push(
        html`<a id=${i} @click=${viewFunc} ><h3 style="display:inline"class=title-link>${i}</h3></a> &nbsp <button @click=${editFunc}><ll-icon name=mdiPencil></ll-icon></button><button @click=${delFunc}><ll-icon name=mdiDelete ></ll-icon></button></br>${unsafeHTML(
          content
        )}</br>`
      );
    }
    return html`<input
        id="search"
        placeholder="Search"
        @input=${this.search}
      /><button @click=${() => {
        window.store.dispatch({ type: "ui/new" });
      }}><ll-icon name= mdiNotePlus ></ll-icon></button></br>${notesHtml}`;
  }
}
customElements.define("ll-notes-list", ll_notes_list);
