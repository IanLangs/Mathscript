// Mutable
let x = 5
console.log(x) // 5
x = 10
console.log(x) // 10

// Inmutable
try {
    //x = 20 // debería dar error
} catch(e) {
    console.log("error mutabilidad") // esperado
}

// Variable
let y = "hola"
console.log(y) // "hola"
// immut y // error no es mutable


// Const
const z = 2
// z = 3 //error