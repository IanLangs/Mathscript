#!/usr/bin/env node
import fs from 'fs'
import { transpile } from './transpile.js'

if(process.argv[2] == "-v" || process.argv[2] == "--version") {
    const url = "https://unpkg.com/@ianlangs/mathscript/package.json"
    const version = (await fetch(url).then(r => r.json()))["version"]
    console.log(`MS versión = ${version}`)
    process.exit(0)
}

const file = process.argv[2]

if (!file) {
    console.log("Uso: ms-node archivo.ms")
    process.exit(1)
}

const code = fs.readFileSync(file, 'utf-8')
const js = transpile(code, file)
eval(js)
