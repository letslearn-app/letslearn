import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import { default as noteCotentStyle } from "./css/note.js"

export class ll_notes_view extends LitElement {
  static properties = { name: {}, addition: {} };
  static styles = css`
    .addition {
      display: flex;
      white-space: nowrap;
      width: 100%;
      overflow: auto;
      overflow-y: hidden;
    }
    .addition::-webkit-scrollbar {
      width: 4px;
    }
    .addition-icon {
      padding: 4px;
      background: white;
      color: black;
      width: fit-content;
      border-radius: 20px;
      display: inline;
      margin-right: 2px;
    }
    .addition-active {
      filter: invert(30%);
    }
  `;
  constructor() {
    super();
  }
  render() {
    var note = store.getState().data.notes[this.name];
    var additionContentIcon = Object.keys(note.addition||{});
    additionContentIcon = additionContentIcon.map((i) => {
      if (i == this.addition) {
        return html`<div
          @click=${() => {
            this.addition = undefined;
          }}
          class="addition-icon addition-active"
        >
          Back to main
        </div>`;
      }
      return html`<div
        @click=${() => {
          this.addition = i;
        }}
        class="addition-icon"
        id=${i}
      >
        ${i}
      </div>`;
    });
    if (this.addition) {
      note = note.addition[this.addition];
    }
    var content = DOMPurify.sanitize(marked.parse(note.content)).replace(
      "\n",
      "<br>"
    );
    var contentDom = document.createElement("div");
    var contentShadow = contentDom.attachShadow({ mode: "open" });

    contentShadow.innerHTML = `<style>${noteCotentStyle()}</style>${content}`;
    
    contentShadow.querySelectorAll("code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return html` <div style="margin: 0.5rem;">
      ${(additionContentIcon.length != 0 &&
        html`
          <div class="addition">
            Addition contents:&nbsp${additionContentIcon}
          </div>
        `) ||
      html``}
      ${contentDom}
    </div>`;
  }
}
customElements.define("ll-note-view", ll_notes_view);
