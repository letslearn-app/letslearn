import localForage from "localforage";

function localForageBackend(name, value) {
  if (arguments.length == 1) {
    return localForage.getItem(name);
  }
  console.log(arguments.length);
  return localForage.setItem(name, value);
}

function localStorageBackend(name, value) {
  if (arguments.length == 0) {
    return Promise.resolve(window.localStorage[name]);
  }
  window.localStorage[name] = value;
  return Promise.resolve();
}
export const storageBackends = { localForageBackend, localStorageBackend };

export class llStorage {
  constructor(name, backend) {
    this.backend = backend;
    this.name = name;
  }
  sync = (state) => {
    return this.backend(this.name, JSON.stringify(state));
  };
  async load() {
    var data = await this.backend(this.name);
    return JSON.parse(data);
  }
}
