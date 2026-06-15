import { obtenerRepositoriosUsuario } from "../GitHub/Operations.js";
async function main() {
    const repositorio = await obtenerRepositoriosUsuario("JoaquinG-eng");
    console.log("Repositorio obtenido:", repositorio);
}

main();