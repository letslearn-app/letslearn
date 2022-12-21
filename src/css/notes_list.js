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

.note-item {
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
  margin-bottom: 10px;
  border-radius: 6px;
  box-shadow: black 0px 0px 2px 0px;
  overflow: hidden;
  padding: 4px;
  backdrop-filter: brightness(0.8);
  -webkit-backdrop-filter: brightness(0.8);
}
@media only screen and (max-width: 600px) {
.note-item {
  margin: 0px;
  border-width:1px;
  border-bottom-style: solid;
  border-radius: 0px;
  box-shadow: none;
  overflow: hidden;
  padding: 4px;
}
}
.button {
  display:flex;
  float: right;
}
`;
