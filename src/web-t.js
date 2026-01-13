import { transpile } from "./web-t.js"

const editor = document.getElementById("editor")
const runButton = document.getElementById("runButton")
const consoleDiv = document.getElementById("console")

function clearConsole() {
    consoleDiv.innerHTML = ""
}

function logToConsole(msg) {
    const line = document.createElement("div")
    line.textContent = msg
    consoleDiv.appendChild(line)
}

runButton.addEventListener("click", () => {
    clearConsole()

    const code = editor.value

    const result = transpile(code, "playground.ms")

    if (result.errors.length > 0) {
        result.errors.forEach(err => logToConsole(err))
        return
    }

    // Capturar console.log
    const originalLog = console.log
    console.log = (...args) => {
        logToConsole(args.join(" "))
        originalLog(...args)
    }

    try {
        eval(result.code)
    } catch (e) {
        logToConsole("[RUNTIME ERROR] " + e.message)
    }

    console.log = originalLog
})
