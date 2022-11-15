import { default as hljsStyleDark } from "highlight.js/styles/dark.css";
import { default as hljsStyleLight } from "highlight.js/styles/default.css";
import { default as scrollbar } from "./scrollbar.js";
import { select } from "./select.js";
function makeStyle(darkmode) {
  if (darkmode) {
    var hljsStyle = hljsStyleDark;
  } else {
    var hljsStyle = hljsStyleLight;
  }
  return `
*{
  ${select}
}
${hljsStyle}
img{
  box-shadow: 0px 0 2px 0px black;
  max-width:100%;
}
pre code{
  box-shadow: 0px 0 2px 0px black;
  border-radius: 6px;
}
${scrollbar("pre code")}
code {
  color: inherit !important;
  background: inherit !important;
}
a{color: darkturquoise;}
`;
}
export { makeStyle as default };
