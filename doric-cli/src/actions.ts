import { Shell } from "./shell";
import { createMergedSourceMapFromFiles } from "source-map-merger"
import fs from "fs";
import { glob } from "./util";
import path from "path";
export async function build() {
    await Shell.exec("node", ["node_modules/.bin/tsc", "-p", "."]);
    await Shell.exec("node", ["node_modules/.bin/rollup", "-c"]);
    const bundleFiles = await glob("bundle/**/*.js");
    for (let bundleFile of bundleFiles) {
        await doMerge(bundleFile);
    }
    if (fs.existsSync("assets")) {
        const assets = await fs.promises.readdir("assets")
        for (let asset of assets) {
            const assetFile = path.resolve("assets", asset);
            const stat = await fs.promises.stat(assetFile);
            await Shell.exec("cp", ["-rf", assetFile, "bundle"]);
            if (stat.isDirectory()) {
                console.log(`Asset -> ${asset.yellow}`);
            } else {
                console.log(`Asset -> ${asset.green}`);
            }
        }
    }
}

export async function clean() {
    await Shell.exec("rm", ["-rf", "build"]);
    await Shell.exec("rm", ["-rf", "bundle"]);
}

async function doMerge(jsFile: string) {
    const mapFile = `${jsFile}.map`;
    console.log(`Bundle -> ${jsFile.green}`);
    if (!fs.existsSync(mapFile)) {
        return;
    }
    console.log(`       -> ${mapFile.green}`);
    await mergeMap(mapFile);
}


export async function mergeMap(mapFile: string) {
    const buildMap = mapFile.replace(/bundle\//, 'build/')
    if (fs.existsSync(buildMap)) {
        const mergedMap = createMergedSourceMapFromFiles([
            buildMap,
            mapFile,
        ], true);
        await fs.promises.writeFile(mapFile, mergedMap);
    }
}