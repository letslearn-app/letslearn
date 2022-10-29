import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
export class ll_notes_view extends LitElement {
  static properties = { name: {},addition:{} };
  static styles=css`
    .addition-icon{
    padding: 4px;
    background: white;
    color: black;
    width: fit-content;
    border-radius: 20px;
    display:inline;
    }
  `
  constructor() {
    super();
  }
  render() {
    var note = store.getState().data.notes[this.name];
    var additionContents=note.addition

    var additionContentIcon=[]
    for(var i in additionContents){
      additionContentIcon.push(html`<div class=addition-icon>${i}<div>`)
    }  
    var content = DOMPurify.sanitize(marked.parse(note.content)).replace(
      "\n",
      "<br>"
    );
    var contentDom = document.createElement("div");
    var contentShadow=contentDom.attachShadow({mode:"open"})
    contentShadow.innerHTML = `<link rel=stylesheet href=${window.hightlightjs_css_url}></link>${content}`;
    contentShadow.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return html`
                <div style="margin: 0.5rem;">
                  ${ additionContentIcon.length!=0&&html`
                    <div style="display:flex">Addition contents:&nbsp${additionContentIcon}
                    </div>
                  `||html``}
                  ${contentDom}
                </div>`;
  }
}
customElements.define("ll-note-view", ll_notes_view);
