import { describe, it, expect } from "vitest";
import {
  createRepositorySchema,
  createIssueSchema,
  createCommitSchema,
} from "../src/schemas/Schemas";

// ─── create_repository ───────────────────────────────────────────────────────
// Tests: acepta nombre válido, rechaza nombre con menos de 3 caracteres,
//        rechaza nombre con caracteres inválidos
describe("createRepositorySchema", () => {
  it("acepta nombre válido", () => {
    const result = createRepositorySchema.safeParse({ name: "mi-repo", description: "", isPrivate: false });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre con menos de 3 caracteres", () => {
    const result = createRepositorySchema.safeParse({ name: "ab", description: "", isPrivate: false });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con caracteres inválidos", () => {
    const result = createRepositorySchema.safeParse({ name: "mi repo!", description: "", isPrivate: false });
    expect(result.success).toBe(false);
  });
});

// ─── create_issue ────────────────────────────────────────────────────────────
// Tests: acepta datos válidos, rechaza título vacío
describe("createIssueSchema", () => {
  it("acepta datos válidos", () => {
    const result = createIssueSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      title: "Bug encontrado",
      body: "",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = createIssueSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      title: "",
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

// ─── create_commit ───────────────────────────────────────────────────────────
// Tests: acepta datos válidos, rechaza mensaje vacío
describe("createCommitSchema", () => {
  it("acepta datos válidos", () => {
    const result = createCommitSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      message: "feat: nuevo archivo",
      filePath: "README.md",
      fileContent: "# Hola",
      branch: "main",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza mensaje vacío", () => {
    const result = createCommitSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      message: "",
      filePath: "README.md",
      fileContent: "# Hola",
      branch: "main",
    });
    expect(result.success).toBe(false);
  });
});