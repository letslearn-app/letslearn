import { select } from "./select.js";
export default `
a {
  ${select}
  color: inherit;
  text-decoration: none;
}
.content-preview{
  ${select}
}
h3 {
  margin-bottom: 1px;
}
.title-link {
  text-decoration: underline;
}
.note-item {
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: black 0px 0px 7px 0px;
  overflow: hidden;
  padding: 4px;
}
.button {
  float: right;
}
`;
