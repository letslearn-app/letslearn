import { LitElement, html, css } from "lit";
import localforage from "localforage";

export class ll_settings extends LitElement {
  static properties = { role: {} };
  constructor() {
    super();
    this.settings = {
      data: html`<a @click=${this.exportData.bind(this)}>Export data file</a
        ><br /><a
          style="color:red"
          @click=${() => {
            this.eraseData();
          }}
          >Erase all the data</a
        >`,
      searcing: html`Search content&nbsp<input
          type="checkbox"
          id="search-content"
          ${(localStorage["searchContent"] == "true" && 'checked=""' ) || ""}
          @input=${() => {
            this.setSearchContent(
              this.shadowRoot.getElementById("search-content").checked
            );
          }} 
        >`,
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
    this.downloadFile(url, "leetlearnData.json");
  }
  eraseData() {
    if (confirm("Are you sure?")) {
      window.store.dispatch({ type: "state/set", state: { notes: {} } });
      window.store.dispatch({ type: "" });
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
        ${this.settings.searcing} `;
    } else {
      return html``;
    }
  }
}
customElements.define("ll-settings", ll_settings);
