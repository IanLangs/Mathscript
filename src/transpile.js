// transpile.js
export function transpile(code, filename = "<input>") {
    const lines = code.split('\n');
    const vars = new Map();
    const output = [];

    function error(line, msg) {
        console.error(`\n[MS ERROR] ${filename}:${line}\n  ${msg}\n`);
        process.exit(1);
    }

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const line = raw.trim();
        const ln = i + 1;

        if (!line) {
            output.push(raw);
            continue;
        }

        // let x = value
        let m = line.match(/^let\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (m) {
            const name = m[1];
            const value = m[2];

            if (vars.has(name)) {
                error(ln, `'${name}' ya está declarada`);
            }

            vars.set(name, { mutable: true });
            output.push(raw);
            continue;
        }

        // immut x
        m = line.match(/^immut\s+([a-zA-Z_]\w*)$/);
        if (m) {
            const name = m[1];

            if (!vars.has(name)) {
                error(ln, `'${name}' no está declarada`);
            }

            const info = vars.get(name);
            if (!info.mutable) {
                error(ln, `'${name}' no es mutable`);
            }

            info.mutable = false;
            continue;
        }

        // x = y
        m = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (m) {
            const name = m[1];
            if (vars.has(name)) {
                const info = vars.get(name);
                if (!info.mutable) {
                    error(ln, `'${name}' es inmutable`);
                }
            }
            output.push(raw);
            continue;
        }

        // const x = ...
        m = line.match(/^const\s+([a-zA-Z_]\w*)\s*=/);
        if (m) {
            vars.set(m[1], { mutable: false });
            output.push(raw);
            continue;
        }

        // fn -> function
        output.push(line.replace(/\bfn\b/g, "function"));
    }

    return output.join('\n');
}

export default { transpile };
