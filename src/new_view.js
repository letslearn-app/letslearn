import { LitElement, html, css } from "lit";
import { ll_button, ll_textinput } from "./widget.js";
export class ll_new_note extends LitElement {
  static properties = { addition:{}, };
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
    var state=window.store.getState().ui
    if (state.mode=="edit"){
      this.edit=true
      this.name=state.name
      var defaultCurrent={name:"",content:"",tags:[],addition:{}}
      this.current=window.store.getState().data.notes[state.name]||defaultCurrent
      if (!this.current.tags){
        this.current.tags=[]
      }
    }
    else{
      this.current=defaultCurrent
    }
  } 
  add() {
    var current=this.current;
    if (current.name === "" || current.content === "") {
      return; 
    } 
    if (this.edit && this.name != current.name) {
      window.store.dispatch({ type: "notes/del", name: this.name });
    }
    window.store.dispatch({ type: "notes/add", content:current });
    window.store.dispatch({ type: "ui/view", name:current.name });
  }
  sync(type){
    
    if (this.addition){
      var current=this.current.addition
    }
    else{var current=this.current}
    switch(type){
      case "title":
        current.name=this.shadowRoot.getElementById("title").value
        break;
      case "content":
        current.content=this.shadowRoot.getElementById("editor").value
        break;
      case "tags":
        current.tags=this.shadowRoot.getElementById("tags").value.split(" ")
        break
    }
  }
  render() { 
    return html`<div id=main style="display: flex; flex-direction: column;height:100%">
      <div style="display:flex">
        <ll-textinput
          value=${this.current.name}
          placeholder="title"
          id="title"
          @input=${()=>{this.sync("title")}}
        >
        </ll-textinput>   
        </div>
        <div style="display:flex">
          Subnotes here
        </div>
        <textarea id="editor" @input=${()=>{this.sync("content")}} >${this.current.content}</textarea>
        <div style="display:flex">
        <ll-textinput
          @input=${()=>{this.sync("tags")}}
          style="flex:1"
          id="tags"  
          placeholder="Tags"
          value=${this.current.tags}
        ></ll-textinput
        ><ll-button stype="width:2rem" @click=${this.add}
          ><ll-icon name="mdiContentSave"></ll-icon
        ></ll-button>
      </div>
    </div>
    <div id=addition></div>`;
  }
}
customElements.define("ll-new-note", ll_new_note);
