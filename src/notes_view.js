import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
export class ll_notes_view extends LitElement {
  static properties = { name: {} };
  constructor() {
    super();
  }
  render() {
    var note = store.getState().data.notes[this.name];

    var content = DOMPurify.sanitize(marked.parse(note.content));
    var ele = document.createElement("div");
    ele.innerHTML = content;
    ele.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return html` <link rel=stylesheet href=${window.hightlightjs_css_url}></link><h2>${this.name}</h2>
      ${ele}`;
  }
}
customElements.define("ll-note-view", ll_notes_view);
