import { obtenerInformacionUsuario } from "../GitHub/Operations.js";
async function main() {
    const repositorio = await obtenerInformacionUsuario("JoaquinG-eng");
    console.log("Repositorio obtenido:", repositorio);
}

main();