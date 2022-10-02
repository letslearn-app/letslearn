import { createStore, combineReducers } from "redux";

function llDataReducer(state = { notes: {} }, action) {
  state["__JUST_LOADED"] = false;
  switch (action.type) {
    case "notes/add":
      state["notes"][action.name] = {
        name: action.name,
        content: action.content,
      };
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
