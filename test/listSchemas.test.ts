import { describe, it, expect } from "vitest";
import {
  listRepositoriesSchema,
  listIssuesSchema,
  listCommitsSchema,
} from "../src/schemas/Schemas";

// ─── list_repositories ───────────────────────────────────────────────────────
// Tests: acepta username válido, rechaza username vacío
describe("listRepositoriesSchema", () => {
  it("acepta un username válido", () => {
    const result = listRepositoriesSchema.safeParse({ username: "JoaquinG-eng" });
    expect(result.success).toBe(true);
  });

  it("rechaza un username vacío", () => {
    const result = listRepositoriesSchema.safeParse({ username: "" });
    expect(result.success).toBe(false);
  });
});

// ─── list_issues ─────────────────────────────────────────────────────────────
// Tests: acepta owner y repo válidos, rechaza repo con menos de 3 caracteres
describe("listIssuesSchema", () => {
  it("acepta owner y repo válidos", () => {
    const result = listIssuesSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo" });
    expect(result.success).toBe(true);
  });

  it("rechaza repo con menos de 3 caracteres", () => {
    const result = listIssuesSchema.safeParse({ owner: "JoaquinG-eng", repo: "ab" });
    expect(result.success).toBe(false);
  });
});

// ─── list_commits ─────────────────────────────────────────────────────────────
// Tests: acepta owner y repo válidos, rechaza owner vacío
describe("listCommitsSchema", () => {
  it("acepta owner y repo válidos", () => {
    const result = listCommitsSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo" });
    expect(result.success).toBe(true);
  });

  it("rechaza owner vacío", () => {
    const result = listCommitsSchema.safeParse({ owner: "", repo: "mi-repo" });
    expect(result.success).toBe(false);
  });
});