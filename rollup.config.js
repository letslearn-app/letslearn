// Import rollup plugins
import html from "@web/rollup-plugin-html";
import { copy } from "@web/rollup-plugin-copy";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import summary from "rollup-plugin-summary";
import replace from "rollup-plugin-replace"
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: ["src/index.html"],
      format: "esm",
      //publicPath: "/static/",
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // Minify HTML template literals
    minifyHTML(),
    // Minify JS
    /*
    terser({
      ecma: 2020,
      module: false,
      warnings: true,
    }),*/
    // Print bundle summary
    // Optional: copy any static assets to build directory
    summary(),
    
     (process.env.dev && livereload()),
     (process.env.dev  && serve({ open: true, port: 8080 ,openPage: '/build/index.html', contentBase: '' }))
  ],
  output: {
    dir: "build",
  },
  preserveEntrySignatures: "strict",
};

