#!/bin/env node
import T from './transpile.js'
import fs from 'fs'
const __code__ = fs.readFileSync(process.argv[2], 'utf-8')

eval(T.transpile(__code__, ...(T.Consts)))