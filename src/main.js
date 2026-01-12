#!/usr/bin/env node

import MS from './transpile.js'
import fs from 'fs'
import readline from 'readline'

// Función para preguntar al usuario
function ask(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close()
            resolve(answer)
        })
    })
}

async function main() {
    const arg1 = process.argv[2] || "msconfig.json"

    if (arg1 === "--init") {
        // Preguntar al usuario
        const strictInput = await ask("¿Querés que sea estricto? (sí/no): ")
        const strict = strictInput.toLowerCase().startsWith("s") // sí → true, no → false

        const filesInput = await ask("Ingresá los archivos .ms separados por espacios: ")
        const files = filesInput.split(" ").filter(f => f.trim().length > 0)

        // Crear config
        MS.configurate = { strict, Files: files }

        // Guardar config en msconfig.json
        fs.writeFileSync("msconfig.json", JSON.stringify(MS.configurate, null, 2), 'utf-8')
        console.log("Archivo msconfig.json creado!")
        return
    }

    // Si no es --init, asumimos que es un archivo de config
    MS.configurate = JSON.parse(fs.readFileSync(arg1, 'utf-8'))

    const strict = MS.configurate["strict"]
    const files = MS.configurate["Files"]

    for (const file of files) {
        const outjs = file.replace(/\.ms$/, ".js")
        let code = fs.readFileSync(file, 'utf-8')
        code = MS.ms2ts(code)
        code = MS.ts2js(code, strict)
        fs.writeFileSync(outjs, code, 'utf-8')
        console.log(`Transpilado ${file} → ${outjs}`)
    }
}

main()
