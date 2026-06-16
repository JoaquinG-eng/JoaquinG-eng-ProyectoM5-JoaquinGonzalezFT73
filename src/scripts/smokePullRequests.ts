import {GitHubPullRequests} from "../GitHub/Operations.js";

async function main() {
    const repositorio = await GitHubPullRequests ("JoaquinG-eng", "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73");
    console.log("Requests recibidas correctamente:", repositorio);
}

main();