import { LitElement, html, css } from "lit";
import localforage from "localforage";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
export class ll_settings extends LitElement {
  static properties = { role: {} };
  constructor() {
    super();
    this.settings = {
      data: html`<a @click=${this.exportData.bind(this)}>Export data file</a>
        <br/>
        <a @click=${this.importData}>Import Data</a></br>
        <a style="color:red"
          @click=${this.eraseData}>
          Erase all the data</a>
      `,
      searching: (() => {
        var chkbox = document.createElement("input");
        chkbox.type = "checkbox";
        chkbox.checked = localStorage["searchContent"] == "true";
        chkbox.oninput = () => {
          this.setSearchContent(chkbox.checked);
        };
        return html`Search content&nbsp ${chkbox}`;
      })(),
    };
  }
  downloadFile(href, filename) {
    const a = document.createElement("a");
    a.download = filename;
    a.style.display = "none";
    a.href = href;
    this.shadowRoot.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(href);
  }
  exportData() {
    var data = JSON.stringify(
      window.store.getState().data,
      "application/octet-stream"
    );
    var blob = new Blob([data]);
    var url = URL.createObjectURL(blob);
    this.downloadFile(url, "letslearnData.json");
  }
  importData() {
    this.readFile().then((file) => {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        window.store.dispatch({
          type: "state/set",
          state: JSON.parse(reader.result),
        });
        window.store.dispatch({ type: "notes/" });
      };
    });
  }
  readFile() {
    var input = document.createElement("input");
    input.type = "file";
    input.click();
    return new Promise((resolve, reject) => {
      input.onchange = () => {
        if (input.files.length != 0) {
          resolve(input.files[0]);
        } else {
          reject("");
        }
      };
    });
  }
  eraseData() {
    if (confirm("Are you sure?")) {
      window.store.dispatch({ type: "state/set", state: { notes: {} } });
      window.store.dispatch({ type: "notes/" });
    }
  }
  setSearchContent(searchContent) {
    localStorage["searchContent"] = searchContent;
  }
  render() {
    if (this.role == "left") {
      return html`<h3>Data</h3>
        ${this.settings.data}
        <h3>Searching</h3>

        ${this.settings.searching} `;
    } else {
      return html``;
    }
  }
}
customElements.define("ll-settings", ll_settings);
