import {default as hljsStyle} from 'highlight.js/styles/dark.css'
import {select} from './select.js'
function makeStyle(){
return `
*{
  ${select}
}
${hljsStyle}
img{
  box-shadow: 0px 0 10px 0px black;
  max-width:100%;
}
pre code{
  box-shadow: 0px 0 10px 0px black;
  border-radius: 6px;
}
code {
  background: inherit !important;
}
a{color: darkturquoise;}
`
}
export {makeStyle as default}

