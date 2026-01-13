#!/usr/bin/env node
import fs from 'fs'
import { transpile } from './transpile.js'

if (process.argv[2] === "-v" || process.argv[2] === "--version") {
    (async () => {
        const url = "https://unpkg.com/@ianlangs/mathscript/package.json"
        const res = await fetch(url)
        const pkg = await res.json()
        console.log(`MS versión = ${pkg.version}`)
        process.exit(0)
    })()
}


const file = process.argv[2]

if (!file) {
    console.log("Uso: ms-node archivo.ms")
    process.exit(1)
}

const code = fs.readFileSync(file, 'utf-8')
const js = transpile(code, file)
eval(js)
