// web-transpile.js
export function transpileWeb(code, filename = "<input>") {
    // reemplazos básicos
    code = code.replace(/using\(/g, "require(") // para compatibilidad, aunque en navegador no sirve
               .replace(/::[^=\n\(\)]*/g, "")
               .replace(/\bfn\b/g, "function")

    const lines = code.split('\n')
    const vars = new Map() // mapa de variables y su tipo: {mutable: true, isMut: true/false}
    const output = []

    function error(line, msg) {
        console.error(`\n[MS ERROR] ${filename}:${line}\n  ${msg}\n`)
    }

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i]
        const line = raw.trim()
        const ln = i + 1

        if (!line) {
            output.push(raw)
            continue
        }

        // mut x = value, let x = value, const x = value
        let m = line.match(/^(mut|let|const)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/)
        if (m) {
            const kind = m[1]
            const name = m[2]
            const value = m[3]

            if (vars.has(name)) {
                error(ln, `'${name}' ya está declarada`)
            }

            if (kind === "mut") {
                vars.set(name, { mutable: true, isMut: true })
                output.push(`let ${name} = ${value}`)
            } else if (kind === "let") {
                vars.set(name, { mutable: true, isMut: false })
                output.push(raw)
            } else { // const
                vars.set(name, { mutable: false, isMut: false })
                output.push(raw)
            }
            continue
        }

        // immut x
        m = line.match(/^immut\s+([a-zA-Z_]\w*)$/)
        if (m) {
            const name = m[1]

            if (!vars.has(name)) {
                error(ln, `'${name}' no está declarada`)
                continue
            }

            const info = vars.get(name)
            if (!info.isMut) {
                error(ln, `'${name}' no es mutable (solo variables declaradas con mut pueden ser inmutables)`)
                continue
            }

            info.mutable = false
            output.push(`// ${name} ahora es inmutable`)
            continue
        }

        // asignaciones normales
        m = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/)
        if (m) {
            const name = m[1]

            if (vars.has(name)) {
                const info = vars.get(name)
                if (!info.mutable) {
                    error(ln, `'${name}' es inmutable`)
                    continue
                }
            }

            output.push(raw)
            continue
        }

        output.push(raw)
    }

    return output.join('\n')
}

export default { transpileWeb }
