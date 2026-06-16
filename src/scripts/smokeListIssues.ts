import { listIssuesTool } from "../tools/listissues.js";

async function main() {
console.log("=== Smoke test: listIssuesTool ===\n");


const resultado = await listIssuesTool({
owner: "JoaquinG-eng",
repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
});
console.log("Issues encontrados:", resultado.count);
console.log("Issues:", resultado.issues);


const invalido = await listIssuesTool({ owner: "", repo: "x" });
console.log("\nInput inválido:", invalido);
}

main();