import { noselect } from "./select";
const css = ` 
body {
  background: #ffffea;
  color: black;
  font-family: sans-serif;
  margin: 0px;
  --ll-active-color: #626262;
  --ll-normal-color: #ccc;
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
