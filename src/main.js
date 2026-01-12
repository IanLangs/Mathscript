#!/bin/env node
import T from './transpile.js'
import fs from 'fs'

function processConfig(config) {
    for (let file of config.Files) {
        try {
            let code = fs.readFileSync(file, "utf-8")
            code = T.transpile(code, ...(T.Consts))
            fs.writeFileSync(file.replace(/\.ms$/g, ".js"), code, 'utf-8')
        } catch(e) {
            console.error(`Error procesando ${file}:`, e.message)
        }
    }
}

if(process.argv[2] == "-i" || process.argv[2] == "--init") {
    let config = {Files:[]}
    config.Files = process.argv.slice(3)
    fs.writeFileSync("msconfig.json", JSON.stringify(config, ["Files"], 4))
    process.exit(0)
} else if (process.argv[2] == "-t" || process.argv[2] == "--transpile") {
    let config = {Files:process.argv.slice(3)}
    processConfig(config)
} else if (process.argv.length == 2) {
    processConfig(JSON.parse(fs.readFileSync("msconfig.json", 'utf-8')))
} else if (process.argv.length == 3) {
    processConfig(JSON.parse(fs.readFileSync(process.argv[2], 'utf-8')))
}