#!/usr/bin/env node
import fs from 'fs'
import { transpile } from './transpile.js'

const file = process.argv[2]

if (!file) {
    console.log("Uso: ms-node archivo.ms")
    process.exit(1)
}

const code = fs.readFileSync(file, 'utf-8')
const js = transpile(code)
eval(js)
