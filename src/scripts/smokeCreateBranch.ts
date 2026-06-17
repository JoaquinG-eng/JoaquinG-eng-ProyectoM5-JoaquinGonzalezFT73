import { createBranchTool } from "../tools/createBranch.js";

async function main() {
  console.log("=== Smoke test: createBranchTool ===\n");

  // ✅ Caso exitoso
  const resultado = await createBranchTool({
    owner: "JoaquinG-eng",
    repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
    branchName: "feature/test-mcp-branch",
    fromBranch: "main",
  });

  if (resultado.error) {
    console.log("❌ Error:", resultado.message);
  } else {
    console.log("✅ Branch creada exitosamente");
    console.log(`   Nombre: ${resultado.branch?.name}`);
    console.log(`   Ref:    ${resultado.branch?.ref}`);
    console.log(`   SHA:    ${resultado.branch?.sha}`);
    console.log(`   URL:    ${resultado.branch?.url}`);
  }

  // ❌ Input inválido
  console.log("\n--- Validando input inválido ---");
  const invalido = await createBranchTool({ owner: "", repo: "x", branchName: "", fromBranch: "main" });
  if (invalido.error) {
    console.log("✅ Validación correcta:", invalido.message);
  }
}

main();