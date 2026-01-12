//const fs = require('fs') inea borrada para poder subir all modulo
import fs from 'fs' //linea parra que siga andando
const files = fs.readdirSync('.')
console.log(files.length) // número de archivos en la carpeta
