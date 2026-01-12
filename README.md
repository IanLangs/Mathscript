# MathScript

## Uso

msc --init &lt;file list&gt;

msc msconfig.json # o solo msc

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
mut x4 = value

//luego
immut x4
```

### tipado

el tipado es opcional, y solo es notacion, porque ms es tipado y no compilado