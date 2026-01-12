#!/bin/env node

import * as ts from "typescript"
import * as fs from "fs"
import { config } from "process"
class regex {

    constructor(p, r) {
        this.p = p
        this.r =r
    }
    replace(s) {
        return s.replace(this.p, this.r)
    }
}

let configurate = {}
const constants1 = [
    new regex(/arr\<(.*?)\>/g, "$1[]"),
    new regex(/map\s*<([^,]*),\s*([^,]*)>/g, "Record<$1, $2>"),
]

const constants2 = [
    new regex(/::/g, ":"),
    new regex(/using\((.*?)\)/g, "require($1)"),
    new regex(/\bstr\b/g, "string"),
    new regex(/\bbool\b/g, "boolean"),
    new regex(/\bmap\b/g, "Record<any, any>"),
    new regex(/\bobj\b/g, "object"),
    new regex(/\barr\b/g, "any[]"),
    new regex(/\bfn\b/g, "function")
]

function ms2ts(code) {
    let result = code
    for (const r of constants1) {
        console.log(r)
        result = r.replace(result)
    }
    for (const r of constants2) {
        console.log(r)
        result = r.replace(result)
    }
    return result
}
function ts2js(code, types) {
    if (types) {
        return ts.transpile(code, { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext })
    } else {
        return ts.transpileModule(code, {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                strict: false
            }
        }).outputText
    }
}

export default {configurate, ms2ts, ts2js}