// Mutable
mut x::number = 5
console.log(x.get()) // 5
x.set(10)
console.log(x.get()) // 10

// Inmutable
immut x
try {
    x.set(20) // debería dar error
} catch(e) {
    console.log("error mutabilidad") // esperado
}

// Variable
let y = "hola"
console.log(y) // "hola"
immut y // no cambia nada


// Const
const z = 2
// z = 3 //error