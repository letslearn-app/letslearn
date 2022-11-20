#!/usr/bin/env node
const fs = require("fs");
const child_process = require("child_process");
const statik = require("node-static");
const esbuild = require("esbuild");
const http = require("http");

const buildConfig = {
    entryPoints: ["src/index.js"],
    bundle: true,
    loader: { ".css": "text" },
};

function build() {
    var gitId = "undefined";
    try {
        gitId = child_process
            .execSync("git rev-parse --short HEAD")
            .asciiSlice()
            .replace("\n", "");
        gitId = "'" + gitId + "'";
    } catch (e) { }
    esbuild
        .build(
            Object.assign(
                { define: { GITID: gitId }, sourcemap: true, outfile: "build/index.js" },
                buildConfig
            )
        )
        .catch(() => { })
        .then(() => {
            fs.copyFile("src/index.html", "build/index.html", () => { });
            if (process.argv.includes("electron")) {
                fs.copyFile("src/electron.js", "build/electron.js", () => { });
                fs.copyFile("./package.electron.json", "build/package.json", () => { });
            } else {
                fs.copyFile("src/sw.js", "build/sw.js", () => { });
                fs.copyFile("src/menifest.json", "build/menifest.json", () => { });
                fs.copyFile("docs/icon.png", "build/icon.png", () => { });
            }
            console.log("Build finished!");
        });
}
function liveserver() {
    const file = new statik.Server("./src");
    http
        .createServer(function(request, response) {
            if (request.url == "/index.js") {
                response.writeHead(200, { "Content-Type": "text/javascript" });
                res = esbuild.buildSync(
                    Object.assign(
                        { write: false, define: { GITID: "'LIVESERVER'" } },
                        buildConfig
                    )
                );
                response.write(res.outputFiles[0].text);
                response.end();
            }
            file.serve(request, response);
        })
        .listen(8080);
}
if (!process.argv.includes("liveserver")) {
    build();
    if (process.argv.includes("watch")) {
        fs.watch("./src", () => {
            console.log("File changed rebuilding");
            build();
        });
    }
    if (process.argv.includes("serve")) {
        const file = new statik.Server("./build");

        http
            .createServer(function(request, response) {
                request
                    .addListener("end", function() {
                        //
                        // Serve files!
                        //
                        file.serve(request, response);
                    })
                    .resume();
            })
            .listen(8080);
    }
} else {
    liveserver();
}
