//types

//Record<T, O> = Record<T, O>
//Record<any, any> = Record<any, any>

let puntajes:number[] = [
    1.6666666666666667
]
for (let i = 2; i < 10;i++) {
    puntajes.push(i * puntajes[0])
}