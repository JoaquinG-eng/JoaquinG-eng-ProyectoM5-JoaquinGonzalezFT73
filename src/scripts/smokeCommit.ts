import { GitHubCommitDetallado } from "../GitHub/Operations.js";

async function main() {
    const repositorio = await GitHubCommitDetallado("JoaquinG-eng", "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73");
    console.log("Commits obtenidos:", repositorio);
}

main();