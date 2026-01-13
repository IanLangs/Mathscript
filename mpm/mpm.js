#!/usr/bin/env node
import fs from "fs"
import path from "path"
import https from "https"
import { execSync } from "child_process"

const args = process.argv.slice(2)
const CWD = process.cwd()
const MODULES_DIR = path.join(CWD, "ms_modules")
const DEFAULT_REPO = "https://ianlangs.github.io/mpm-ms/"

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest)
        https.get(url, res => {
            if (res.statusCode !== 200) {
                reject("HTTP " + res.statusCode)
                return
            }
            res.pipe(file)
            file.on("finish", () => {
                file.close()
                resolve()
            })
        }).on("error", err => {
            fs.unlinkSync(dest)
            reject(err)
        })
    })
}

function installFromDefault(pkg) {
    const url = DEFAULT_REPO + pkg + ".ms"
    const dest = path.join(MODULES_DIR, pkg + ".ms")
    console.log("Installing", pkg, "from", url)
    return download(url, dest)
}

function installFromCustom(url) {
    const name = url.split("/").pop()
    const dest = path.join(MODULES_DIR, name)
    console.log("Installing", name, "from", url)
    return download(url, dest)
}

function installFromNpm(pkg) {
    console.log("Installing from npm:", pkg)
    execSync("npm install " + pkg, { stdio: "inherit" })
}

function usage() {
    console.log(`
mpm - MS Package Manager

Commands:

mpm -i <package>           install from default repo
mpm -i -c <url>            install from custom url
mpm -n <package>           install from npm

Examples:

mpm -i math
mpm -i -c https://site.com/lib.ms
mpm -n lodash
`)
}

ensureDir(MODULES_DIR)

if (args.length == 0) {
    usage()
    process.exit(0)
}

try {
    if (args[0] == "-i" || args[0] == "--install") {
        if (args[1] == "-c" || args[1] == "--custom") {
            const url = args[2]
            if (!url) throw "Missing URL"
            await installFromCustom(url)
        } else {
            const pkg = args[1]
            if (!pkg) throw "Missing package name"
            await installFromDefault(pkg)
        }
    }

    else if (args[0] == "-n" || args[0] == "--npm") {
        const pkg = args[1]
        if (!pkg) throw "Missing npm package"
        installFromNpm(pkg)
    }

    else {
        usage()
    }

    console.log("Done.")
}
catch(e) {
    console.error("\n[MPM ERROR]\n", e)
}
