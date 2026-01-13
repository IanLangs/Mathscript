#!/usr/bin/env node
import fs from 'fs'
import { transpile } from './transpile.js'

if (process.argv[2] === "-v" || process.argv[2] === "--version") {
    await (async () => {
        const url = "https://unpkg.com/@ianlangs/mathscript/package.json"
        const res = await fetch(url)
        const pkg = await res.json()
        console.log(`MS versión = ${pkg.version}`)
        process.exit(0)
    })()
}

function init(files) {
    const config = { Files: files }
    fs.writeFileSync('msconfig.json', JSON.stringify(config, null, 4))
    console.log('msconfig.json creado')
}

function transpileFiles(files) {
    for (const file of files) {
        const code = fs.readFileSync(file, 'utf-8')
        const out = transpile(code, file)
        fs.writeFileSync(file.replace(/\.ms$/, '.js'), out)
        console.log(`✔ ${file}`)
    }
}

function transpileFromConfig(path = 'msconfig.json') {
    const config = JSON.parse(fs.readFileSync(path, 'utf-8'))
    transpileFiles(config.Files)
}

const args = process.argv.slice(2)

if (args[0] === '--init' || args[0] === '-i') {
    init(args.slice(1))
}
else if (args[0] === '--transpile' || args[0] === '-t') {
    transpileFiles(args.slice(1))
}
else if (args.length === 0) {
    transpileFromConfig()
}
else if (args.length === 1 && args[0].endsWith('.json')) {
    transpileFromConfig(args[0])
}
else {
    console.log(`Uso:

msc --init <archivos.ms>
msc -i <archivos.ms>

msc --transpile <archivos.ms>
msc -t <archivos.ms>

msc <config.json>
msc
`)
}
