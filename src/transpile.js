const Consts = [
    [/::\s*[^\s\(\)]*/g, ""],
    [/mut\s+([a-zA-Z_]\w*)\s*=\s*(.+)/g, "let $1= (()=>{let v=$2; return {get:()=>v,set:n=>v=n}})()"],
    [/immut\s+([a-zA-Z_]\w*)/g, "delete $1.set"],
    ["using", "require"],
    [/fn/g, "function"],
]

function transpile(code, ...consts) {
    for (let [i, j] of consts) {
        code = code.replace(i, j)
    }
    return code
}

export default {transpile, Consts}