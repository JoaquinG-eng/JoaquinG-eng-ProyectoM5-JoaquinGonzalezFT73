import { listRepositoriesTool } from "../tools/listRepositories.js";

async function main() {
console.log("=== Smoke test: listRepositoriesTool ===\n");


const resultado = await listRepositoriesTool({ username: "JoaquinG-eng" });
console.log("Repositorios encontrados:", resultado.count);
console.log("Primer repo:", resultado.repositories?.[0]);


const invalido = await listRepositoriesTool({ username: "" });
console.log("\nInput inválido:", invalido);
}

main();