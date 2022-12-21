import { noselect } from "./select";
const css = ` 
body {
  background: #fafafa;
  color: black;
  font-family: sans-serif;
  margin: 0px;
  --ll-active-color: #373737;
  --ll-normal-color: #5f5f5f;
  ${noselect}
}


.darkmode {
  background: #2a2a2e;
  color: #ccc;
  --ll-active-color: #22222c;
  --ll-normal-color: #3a3a3a;
}
html::-webkit-scrollbar{
  display: none;
}`;
export { css as default };
