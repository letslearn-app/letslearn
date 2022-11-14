#!/usr/bin/env node
const fs = require("fs");
const child_process = require('child_process')
const statik = require("node-static");
function build() {
  var gitId="undefined"
  try{
    gitId=child_process.execSync('git rev-parse --short HEAD').asciiSlice().replace("\n","")
    gitId="'"+gitId+"'"
  }
  catch(e){}
  require("esbuild")
    .build({
      entryPoints: ["src/index.js"],
      bundle: true,
      define:{GITID:gitId},
      sourcemap: true,
      loader: { ".css": "text" },
      outfile: "build/index.js",
    })
    .catch(() => {})
    .then(() => {
      fs.copyFile("src/index.html", "build/index.html", () => {});
      if (process.argv.includes("electron")) {
        fs.copyFile("src/electron.js", "build/electron.js", () => {});
        fs.copyFile("./package.electron.json", "build/package.json", () => {});
      } else {
        fs.copyFile("src/sw.js", "build/sw.js", () => {});
        fs.copyFile("src/menifest.json", "build/menifest.json", () => {});
        fs.copyFile("docs/icon.png", "build/icon.png", () => {});
      }
      console.log("Build finished!");
    });
}
build();
if (process.argv.includes("watch")) {
  fs.watch("./src", ()=>{
console.log("File changed rebuilding")
build()});
}
if (process.argv.includes("serve")) {
  const file = new statik.Server("./build");

  require("http")
    .createServer(function (request, response) {
      request
        .addListener("end", function () {
          //
          // Serve files!
          //
          file.serve(request, response);
        })
        .resume();
    })
    .listen(8080);
}
