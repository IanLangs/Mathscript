const Consts = [
  [/::\s*[^\s\(\)]*/g, ""],
  [/mut\s+([a-zA-Z_]\w*)\s*=\s*(.+)/g, "let $1 = (()=>{let v=$2; return {get:()=>v,set:n=>v=n}})()"],
  [/immut\s+([a-zA-Z_]\w*)/g, "delete $1.set"],
  [/using\(/g, "require("],
  [/fn/g, "function"],
]

function analyzeMS(code) {
  const lines = code.split("\n")
  const scopes = [new Map()] // nombre -> { mut: boolean, kind }

  function findVar(name) {
    for (let s of scopes) {
      if (s.has(name)) return s.get(name)
    }
    return null
  }

  lines.forEach((line, i) => {
    const ln = i + 1
    const trimmed = line.trim()

    if (trimmed.includes("{")) scopes.unshift(new Map())
    if (trimmed.includes("}")) scopes.shift()

    // mut x = ...
    const mutMatch = line.match(/^\s*mut\s+([a-zA-Z_]\w*)/)
    if (mutMatch) {
      const name = mutMatch[1]
      scopes[0].set(name, { mut: true, kind: "mut" })
      return
    }

    // let x = ...
    const letMatch = line.match(/^\s*let\s+([a-zA-Z_]\w*)/)
    if (letMatch) {
      const name = letMatch[1]
      scopes[0].set(name, { mut: false, kind: "let" })
      return
    }

    // const x = ...
    const constMatch = line.match(/^\s*const\s+([a-zA-Z_]\w*)/)
    if (constMatch) {
      const name = constMatch[1]
      scopes[0].set(name, { mut: false, kind: "const" })
      return
    }

    // immut x
    const im = line.match(/^\s*immut\s+([a-zA-Z_]\w*)/)
    if (im) {
      const name = im[1]
      const v = findVar(name)

      if (!v) {
        throw new Error(`MS Compile Error (line ${ln}): '${name}' is not declared`)
      }

      if (!v.mut) {
        throw new Error(
          `MS Compile Error (line ${ln}): '${name}' is not mutable (declared as ${v.kind})`
        )
      }

      v.mut = false
      return
    }
  })
}


function transpile(code, ...consts) {
  analyzeMS(code)

  for (let [i, j] of consts) {
    code = code.replace(i, j)
  }
  return code
}

export default { transpile, Consts }
