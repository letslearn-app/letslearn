import { createStore, combineReducers } from "redux";
export const defaultNote = { name: "", content: "", tags: [], addition: {} };
export const LL_DATA_VERISION = 1; // Increace it only when data model changed
function llDataReducer(state = { notes: {}, LL_DATA_VERISION }, action) {
  if (action.type.startsWith("notes")) {
    state["__JUST_LOADED"] = false;
    state["__DELTA"]=action
  }
  switch (action.type) {
    case "notes/add":
      var note = action.content;
      state["notes"][action.content.name] = note;
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
      state.name = undefined;
      return state;
    case "ui/settings":
      state.mode = "settings";
      state.name = "Settings";
      return state;
    case "ui/about":
      state.mode = "about";
      state.name = "About";
      return state;
    case "ui/norm":
      state.name = undefined;
      state.mode = undefined;
      return state;
    default:
      return state;
  }
}
function llPreferenceReducer(state={},action){
  if(action.type.startsWith("pref/")){
    state.__DELTA=action.type
  }
  switch (action.type){
    case "pref/set":
      Object.assign(state,action.data)
      break;
    case "pref/load":
      state=action.data
      break;
  }
  return state
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
  combineReducers({ data: llDataReducer, ui: llUiReducer,pref:llPreferenceReducer })
);

store.subscribeDataChange = subscribeDataChange.bind(store);
store.subscribeUiChange = subscribeUiChange.bind(store);
export { store };
