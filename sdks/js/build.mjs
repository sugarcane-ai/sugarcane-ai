// const { build } = require("esbuild");
// const { dependencies, peerDependencies } = require("./package.json");
// const { Generator } = require("npm-dts");
import { build, analyzeMetafile } from "esbuild";
import pkg from "npm-dts";
import pj from "./package.json" assert { type: "json" };
import fs from "node:fs";
import { nodeExternalsPlugin } from "esbuild-node-externals";

const outputDir = `dist`;

new pkg.Generator({
  entryPoints: ["src/**/*.ts", "src/*.ts"],
  // entry: "src/index.ts",
  output: `${outputDir}/esm/index.d.ts`,
  outdir: `${outputDir}/esm`,
  tsc: `--extendedDiagnostics -p ./tsconfig.types.json`,
}).generate();

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,

  // size optimizations
  minify: true,
  metafile: true,
  treeShaking: true,
  // nativeZip: true, // bundle as a single file

  // Sourcemaps
  sourcemap: true,

  // Remove unsued code
  drop: ["debugger"],
  dropLabels: ["DEV", "TEST"],

  // External dependencies
};

// cjs
// build({
//   ...sharedConfig,
//   platform: "node", // for CJS
//   // outfile: `${outputDir}/cjs/index.js`,
//   outdir: `${outputDir}/cjs/`,
// });

// esm
let result = await build({
  ...sharedConfig,
  // splitting: true,
  outfile: `${outputDir}/esm/index.mjs`,
  // outdir: `${outputDir}/esm`,
  platform: "neutral", // for ESM
  format: "esm",
  external: Object.keys(pj.dependencies).concat(
    Object.keys(pj.peerDependencies),
  ),
  // plugins: [nodeExternalsPlugin()],
});

// console.log(result);

fs.writeFileSync("meta.json", JSON.stringify(result.metafile));

console.log(
  await analyzeMetafile(result.metafile, {
    verbose: false,
  }),
);

let jsVABuildResult = await build({
  ...sharedConfig,
  entryPoints: ["src/js/voice_assistant.js"],
  outfile: `${outputDir}/js/copilot-one-voice-assistant.min.js`,
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
});

fs.writeFileSync("meta-js-va.json", JSON.stringify(jsVABuildResult.metafile));

let jsTABuildResult = await build({
  ...sharedConfig,
  entryPoints: ["src/js/text_assistant.js"],
  outfile: `${outputDir}/js/copilot-one-text-assistant.min.js`,
  bundle: true,
  minify: true,
  platform: "browser",
  format: "iife",
});

fs.writeFileSync("meta-js-ta.json", JSON.stringify(jsTABuildResult.metafile));

// jsBuildResult;
