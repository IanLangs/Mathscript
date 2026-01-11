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

let config = {}

const constants = [
    regex(/::/g, ":"),
    regex(/using\((.*?)\)/g, "requiere($1)"),
    regex(/\bstr\b/g, "string"),
    regex(/\bbool\b/g, "boolean"),
    regex(/\bmap\s*<([^,]*),\s*([^,]*)>\b/g, "Record<$1, $2>"),
    regex(/\bmap\b/g, "Record<any, any>"),
    regex(/\bobj\b/g, "object"),
    regex(/\barr<(.*?)>\b/g, "$1[]"),
    regex(/\barr\b/g, "any[]"),
    regex(/\bfn\b/g, "function")
]

function ms2ts(code) {
    let result = code;
    for (const r of constants) {
        result = r.replace(result);
    }
    return result;
}
function ts2js(code, types) {
    if (types) {
        return ts.transpile(code, { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext });
    } else {
        return ts.transpileModule(code, {
            compilerOptions: {
                target: ts.ScriptTarget.ES2020,
                module: ts.ModuleKind.ESNext,
                strict: false
            }
        }).outputText;
    }
}

export default {config, ms2ts, ts2js}