export default function(selector){
return `
${selector}::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
${selector}::-webkit-scrollbar-track {
  background-color: initial;
}
${selector}::-webkit-scrollbar-thumb {
  background-color: rgba(249, 249, 249, 0.39);
  border-radius: 4px;
}
`
}
