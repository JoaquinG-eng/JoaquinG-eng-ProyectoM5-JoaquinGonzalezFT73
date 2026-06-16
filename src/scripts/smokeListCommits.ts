import { listCommitsTool } from "../tools/listCommits.js";

async function main() {
console.log("=== Smoke test: listCommitsTool ===\n");


const resultado = await listCommitsTool({
owner: "JoaquinG-eng",
repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
});
console.log("Commits encontrados:", resultado.count);
console.log("Primer commit:", resultado.commits?.[0]);


const invalido = await listCommitsTool({ owner: "", repo: "x" });
console.log("\nInput inválido:", invalido);
}

main();