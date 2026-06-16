import {GitHubIssues } from "../GitHub/Operations.js";

async function main() {
    const repositorio = await GitHubIssues ("JoaquinG-eng", "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73");
    console.log("Issues obtenidos:", repositorio);
}

main();