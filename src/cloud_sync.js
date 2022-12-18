export class cloudSync {
  constructor() {
    this.syncUrl = undefined;
    this.data = [];
  }
  setSyncUrl(url) {
    this.syncUrl = url;
  }
  putData(action) {
    this.data.push(action);
  }
  push() {
    var body = { data: this.data, ver: 1 };
    return new Promise((solved, reject) => {
      fetch(this.syncUrl, { method: "POST", body: JSON.stringify(body) })
        .then((res) => {
          if (res.ok) {
            res.json().then(solved);
          } else {
            reject();
          }
        })
        .catch(reject);
    });
  }
  pull() {
    return new Promise((solved, reject) => {
      fetch(this.syncUrl)
        .then((res) => {
          if (!res.ok) {
            reject();
          }
          res.json().then((res) => {
            solved(res);
          });
        })
        .catch(reject);
    });
  }
}
