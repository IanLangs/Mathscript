export function transpile(code) {
    const lines = code.split('\n')
    const vars = new Map()
    const output = []

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i]
        const line = raw.trim()

        if (!line) {
            output.push(raw)
            continue
        }

        // mut x = value
        let m = line.match(/^mut\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/)
        if (m) {
            const name = m[1]
            const value = m[2]

            if (vars.has(name)) {
                throw new Error(`L${i+1}: '${name}' ya está declarada`)
            }

            vars.set(name, { mutable: true })
            output.push(`let ${name} = ${value}`)
            continue
        }

        // immut x
        m = line.match(/^immut\s+([a-zA-Z_]\w*)$/)
        if (m) {
            const name = m[1]

            if (!vars.has(name)) {
                throw new Error(`L${i+1}: '${name}' no está declarada`)
            }

            const info = vars.get(name)
            if (!info.mutable) {
                throw new Error(`L${i+1}: '${name}' no es mutable`)
            }

            info.mutable = false
            continue
        }

        // x = y
        m = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/)
        if (m) {
            const name = m[1]
            if (vars.has(name)) {
                const info = vars.get(name)
                if (!info.mutable) {
                    throw new Error(`L${i+1}: '${name}' es inmutable`)
                }
            }
            output.push(raw)
            continue
        }

        // let x =
        m = line.match(/^let\s+([a-zA-Z_]\w*)\s*=/)
        if (m) {
            vars.set(m[1], { mutable: true })
            output.push(raw)
            continue
        }

        // const x =
        m = line.match(/^const\s+([a-zA-Z_]\w*)\s*=/)
        if (m) {
            vars.set(m[1], { mutable: false })
            output.push(raw)
            continue
        }

        output.push(raw)
    }

    return output.join('\n')
}

export default { transpile }
