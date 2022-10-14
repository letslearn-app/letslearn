import { createStore, combineReducers } from "redux";

function llDataReducer(state = { notes: {} }, action) {
  state["__JUST_LOADED"] = false;
  switch (action.type) {
    case "notes/add":
      var note = {
        name: action.name,
        content: action.content,
      };
      if (action.tags instanceof Array) {
        note.tags = action.tags;
      }
      state["notes"][action.name] = note;
      return state;
    case "notes/del":
      delete state["notes"][action.name];
      return state;
    case "state/set":
      state = action.state;
      state["__JUST_LOADED"] = true;
      return state;
    default:
      return state;
  }
}
function llUiReducer(state = {}, action) {
  state = {};
  switch (action.type) {
    case "ui/view":
      state.mode = "view";
      state.name = action.name;
      return state;
    case "ui/edit":
      state.mode = "edit";
      state.name = action.name;
      return state;
    case "ui/new":
      state.mode = "new";
      return state;
    case "ui/settings":
      state.mode = "settings";
      return state;
    case "ui/norm":
      state = {};
      return state;
    default:
      return state;
  }
}
function subscribeDataChange(func) {
  this.subscribe(() => {
    var state = this.getState().data;
    if (!state.__JUST_LOADED) {
      func(state);
    }
  });
}
function subscribeUiChange(func) {
  this.subscribe(() => {
    var state = this.getState().ui;
    func(state);
  });
}
var store = createStore(
  combineReducers({ data: llDataReducer, ui: llUiReducer })
);

store.subscribeDataChange = subscribeDataChange.bind(store);
store.subscribeUiChange = subscribeUiChange.bind(store);
export { store };
