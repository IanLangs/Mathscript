# MathScript

## Uso

msc --init

msc msconfig.json

## Configuración

- msc --init -> te pregunta cómo configurar
- Files -> archivos a traducir
- strict -> si es true, requiere tipado; si es false, no

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

### Tipos

```ms
a: str = "string"
b: bool = true
c: obj = { "x": a, "y": b }
d: arr<str> = [
    "string",
    "list"
]
```

compila a:

```js
a = "string"
b = true
c = { "x": a, "y": b }
d = [
    "string",
    "list"
]
```

### Notas

- Los tipos son solo para el compilador, JS no los interpreta en runtime.  
- Puedes usar `arr<tipo>` para listas tipadas y `obj<key,value>` para objetos complejos.  
- Las funciones y módulos se traducen directamente a JS limpio.  
- `strict: true` fuerza tipado, `strict: false` permite inferencia flexible.  
