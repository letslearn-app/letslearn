import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { ll_button, ll_textinput } from "./widget.js";
import { mdiNotePlus, mdiDelete, mdiPencil } from "@mdi/js";
export class ll_notes_list extends LitElement {
  static properties = { searchRes: {} };
  static styles = css`
    a {
      color: inherit;
      text-decoration: none;
    }
    h3 {
      margin-bottom: 1px;
    }
    .title-link {
      text-decoration: underline;
    }
    .note-item {
      margin-top: 4px;
      margin-left: 4px;
      margin-right: 4px;
      margin-bottom: 10px;
      border-radius: 6px;
      box-shadow: black 0px 0px 7px 0px;
      overflow: hidden;
      padding: 4px;
    }
    .button {
      float: right;
    }
  `;
  constructor() {
    super();
    this.searchContent = localStorage["searchContent"] == "true";
    window.store.subscribe(this.update.bind(this));
  }
  search() {
    var res = [];
    var value = this.shadowRoot.getElementById("search").value;
    if (value == "") {
      this.searchRes = undefined;
    }
    var notes = window.store.getState().data.notes;
    for (var i in notes) {
      if (i.indexOf(value) > -1) {
        res.push(i);
      }
      if (this.searchContent) {
        if (notes[i].content.indexOf(value) > -1) {
          res.push(i);
        }
      }
      for (var n of notes[i].tags) {
        if (n == value) {
          res.push(i);
        }
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
      var i_safe = i.replaceAll('"', '\\"');
      var viewFunc = Function(`this.viewNote("${i_safe}")`).bind(this); //Very ugly but work
      var editFunc = Function(`this.editNote("${i_safe}")`).bind(this);
      var delFunc = Function(`this.delNote("${i_safe}")`).bind(this);
      notesHtml.push(
        html`<div class=note-item>
            <a id=${i} @click=${viewFunc} >
              <h3 style="display:inline"class=title-link>${i}</h3>
            </a> 
            &nbsp
            <div  class=button>
            <ll-button @click=${editFunc}>
              <ll-icon path=${mdiPencil}></ll-icon>
            </ll-button>
            <ll-button class=button @click=${delFunc}>
              <ll-icon path=${mdiDelete} ></ll-icon>
            </ll-button></div>
            </br>
            <div class=content-preview>${unsafeHTML(content)}</div>
            </div>`
      );
    }
    return html`<div>
        <ll-textinput
          id="search"
          placeholder="Search"
          @input=${this.search}
        ></ll-textinput>
        <ll-button
          @click=${() => {
            window.store.dispatch({ type: "ui/new" });
          }}
        >
          <ll-icon path=${mdiNotePlus}></ll-icon>
        </ll-button>
      </div>
      ${notesHtml}`;
  }
}
customElements.define("ll-notes-list", ll_notes_list);
