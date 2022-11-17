import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { ll_button, ll_textinput } from "./widget.js";
import { mdiNotePlus, mdiDelete, mdiPencil } from "@mdi/js";
import { default as notes_list_css } from "./css/notes_list.js";
export class ll_notes_list extends LitElement {
  static properties = { searchRes: {} };
  static styles = css([notes_list_css]);
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
    window.store.dispatch({ type: "ui/" });
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
      var editFunc = Function('e',`this.editNote("${i_safe}");e.stopPropagation()`).bind(this);
      var delFunc = Function('e',`this.delNote("${i_safe}");e.stopPropagation()`).bind(this);
      notesHtml.push(
        html`<div @click=${viewFunc} class=note-item>
            <a id=${i} >
              <h3 style="display:inline"class=title-link>${i}</h3>
            </a> 
            &nbsp
            <div  class=button>
            <ll-button @click=${editFunc}>
              <ll-icon path=${mdiPencil}></ll-icon>
            </ll-button>
            <ll-button class=button @click=${delFunc}>
              <ll-icon path=${mdiDelete} style='color:red' ></ll-icon>
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
