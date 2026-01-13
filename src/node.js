#!/usr/bin/env node
import fs from "fs"
import T from "./transpile.js"

const file = process.argv[2]
if (!file) {
  console.error("Usage: ms-node <file.ms>")
  process.exit(1)
}


const source = fs.readFileSync(file, "utf-8")
const js = T.transpile(source, ...(T.Consts))
const run = new Function(js)
run()
