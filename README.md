# MathScript

## Uso

### compilar

msc --init &lt;file list&gt;

msc msconfig.json # o solo msc

### ejecutar (un solo archivo)

ms-node main.ms

## Configuración

- msc --init &lt;file list&gt; -> genera msconfig.json
- Files -> archivos a traducir

## Sintaxis

### Funciones

```ms
using("module")
fn f(x) {
    return x
}
```

compila a:

```js
require("module")
function f(x) {
    return x
}
``` 

### variables

```ms
var x1 = value
let x2 = value
const x3 = value

//luego, solo con let
immut x2
```
