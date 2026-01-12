const fs = using('fs')
const files = fs.readdirSync('.')
console.log(files.length) // número de archivos en la carpeta
