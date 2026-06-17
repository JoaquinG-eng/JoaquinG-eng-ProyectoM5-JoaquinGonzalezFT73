import { describe, it, expect } from "vitest";
import { listRepositoriesSchema } from "../src/tools/listRepositories.js";
import { listIssuesSchema } from "../src/tools/listissues.js";
import { listCommitsSchema } from "../src/tools/listCommits.js";
import { createRepositorySchema } from "../src/tools/createRepository.js";
import { createIssueSchema } from "../src/tools/createIssue.js";
import { createCommitSchema } from "../src/tools/createCommit.js";
import { closeIssueSchema } from "../src/tools/closeIssue.js";
import { createBranchSchema } from "../src/tools/createBranch.js";
import { createPullRequestSchema } from "../src/tools/createPullRequest.js";

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

describe("createRepositorySchema", () => {
  it("acepta nombre válido", () => {
    const result = createRepositorySchema.safeParse({ name: "mi-repo", description: "", isPrivate: false });
    expect(result.success).toBe(true);
  });

  it("rechaza nombre con un solo carácter", () => {
    const result = createRepositorySchema.safeParse({ name: "x", description: "", isPrivate: false });
    expect(result.success).toBe(false);
  });

  it("rechaza nombre con caracteres inválidos", () => {
    const result = createRepositorySchema.safeParse({ name: "mi repo!", description: "", isPrivate: false });
    expect(result.success).toBe(false);
  });
});

describe("createIssueSchema", () => {
  it("acepta datos válidos", () => {
    const result = createIssueSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", title: "Bug encontrado", body: "" });
    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = createIssueSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", title: "", body: "" });
    expect(result.success).toBe(false);
  });
});

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

describe("closeIssueSchema", () => {
  it("acepta número de issue válido", () => {
    const result = closeIssueSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", issue_number: 1 });
    expect(result.success).toBe(true);
  });

  it("rechaza número de issue negativo", () => {
    const result = closeIssueSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", issue_number: -1 });
    expect(result.success).toBe(false);
  });
});

describe("createBranchSchema", () => {
  it("acepta datos válidos", () => {
    const result = createBranchSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", branchName: "feature/nueva", fromBranch: "main" });
    expect(result.success).toBe(true);
  });

  it("rechaza branchName vacío", () => {
    const result = createBranchSchema.safeParse({ owner: "JoaquinG-eng", repo: "mi-repo", branchName: "", fromBranch: "main" });
    expect(result.success).toBe(false);
  });
});

describe("createPullRequestSchema", () => {
  it("acepta datos válidos", () => {
    const result = createPullRequestSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      title: "feat: nueva feature",
      body: "",
      head: "feature/nueva",
      base: "main",
      draft: false,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza head vacío", () => {
    const result = createPullRequestSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      title: "feat: nueva feature",
      body: "",
      head: "",
      base: "main",
      draft: false,
    });
    expect(result.success).toBe(false);
  });
});