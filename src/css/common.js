import { noselect } from "./select";
const css = ` 
body {
  background: #ffffe0;
  color: black;
  font-family: sans-serif;
  margin: 0px;
  --ll-active-color: #22222c;
  --ll-normal-color: #3a3a3a;
  ${noselect}
}



.darkmode {
  background: #2a2a2e;
  color: #ccc;
}
html::-webkit-scrollbar{
  display: none;
}`;
export { css as default };
