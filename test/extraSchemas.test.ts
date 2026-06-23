import { describe, it, expect } from "vitest";
import {
  closeIssueSchema,
  createBranchSchema,
  createPullRequestSchema,
} from "../src/schemas/Schemas";

// ─── close_issue ─────────────────────────────────────────────────────────────
// Tests: acepta número de issue válido, rechaza número de issue negativo
describe("closeIssueSchema", () => {
  it("acepta número de issue válido", () => {
    const result = closeIssueSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      issue_number: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza número de issue negativo", () => {
    const result = closeIssueSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      issue_number: -1,
    });
    expect(result.success).toBe(false);
  });
});

// ─── create_branch ───────────────────────────────────────────────────────────
// Tests: acepta datos válidos, rechaza branchName vacío
describe("createBranchSchema", () => {
  it("acepta datos válidos", () => {
    const result = createBranchSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      branchName: "feature/nueva",
      fromBranch: "main",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza branchName vacío", () => {
    const result = createBranchSchema.safeParse({
      owner: "JoaquinG-eng",
      repo: "mi-repo",
      branchName: "",
      fromBranch: "main",
    });
    expect(result.success).toBe(false);
  });
});

// ─── create_pull_request ─────────────────────────────────────────────────────
// Tests: acepta datos válidos, rechaza head vacío
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