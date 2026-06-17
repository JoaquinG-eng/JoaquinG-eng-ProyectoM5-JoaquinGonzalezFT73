import { closeIssueTool } from "../tools/closeIssue.js";

async function main() {
  console.log("=== Smoke test: closeIssueTool ===\n");

  // ✅ Caso exitoso - cerrá un issue existente (cambiá el número por uno real)
  const resultado = await closeIssueTool({
    owner: "JoaquinG-eng",
    repo: "JoaquinG-eng-ProyectoM5-JoaquinGonzalezFT73",
    issue_number: 1,
  });

  if (resultado.error) {
    console.log("❌ Error:", resultado.message);
  } else {
    console.log("✅ Issue cerrado exitosamente");
    console.log(`   Número: #${resultado.issue?.number}`);
    console.log(`   Título: ${resultado.issue?.title}`);
    console.log(`   Estado: ${resultado.issue?.state}`);
    console.log(`   URL:    ${resultado.issue?.url}`);
  }

  // ❌ Input inválido
  console.log("\n--- Validando input inválido ---");
  const invalido = await closeIssueTool({ owner: "", repo: "x", issue_number: -1 });
  if (invalido.error) {
    console.log("✅ Validación correcta:", invalido.message);
  }
}

main();