// Mutable
let x = (()=>{let v=5; return {get:()=>v,set:n=>v=n}})()
console.log(x.get()) // 5
x.set(10)
console.log(x.get()) // 10

// Inmutable
delete x.set
try {
    x.set(20) // debería dar error
} catch(e) {
    console.log("error mutabilidad") // esperado
}

// Variable
let y = "hola"
console.log(y) // "hola"
// delete y.set // error no es mutable


// Const
const z = 2
// z = 3 //error