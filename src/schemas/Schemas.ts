import { z } from "zod";

// ─── Schemas compartidos ─────────────────────────────────────────────────────

const ownerSchema = z
  .string()
  .min(1, "El owner no puede estar vacío")
  .max(39, "El owner no puede superar 39 caracteres");

const repoSchema = z
  .string()
  .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
  .max(100, "El nombre del repositorio no puede superar 100 caracteres")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido");

// ─── list_repositories ───────────────────────────────────────────────────────

export const listRepositoriesSchema = z.object({
  username: z
    .string()
    .transform(val => val.trim())
    .pipe(z
      .string()
      .min(1, "El nombre de usuario no puede estar vacío")
      .max(39, "El nombre de usuario no puede superar 39 caracteres")
      .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/, "Nombre de usuario inválido")
    ),
});

// ─── list_issues ─────────────────────────────────────────────────────────────

export const listIssuesSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
});

// ─── list_commits ─────────────────────────────────────────────────────────────

export const listCommitsSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
});

// ─── create_repository ───────────────────────────────────────────────────────

export const createRepositorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "El nombre solo puede contener letras, números, guiones, puntos y guiones bajos"),
  description: z
    .string()
    .max(350, "La descripción no puede superar 350 caracteres")
    .optional()
    .default(""),
  isPrivate: z
    .boolean()
    .optional()
    .default(false),
});

// ─── create_issue ────────────────────────────────────────────────────────────

export const createIssueSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(256, "El título no puede superar 256 caracteres"),
  body: z
    .string()
    .max(65536, "El cuerpo no puede superar 65536 caracteres")
    .optional()
    .default(""),
});

// ─── create_commit ───────────────────────────────────────────────────────────

export const createCommitSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
  message: z
    .string()
    .min(1, "El mensaje del commit no puede estar vacío")
    .max(256, "El mensaje del commit no puede superar 256 caracteres"),
  filePath: z
    .string()
    .min(1, "La ruta del archivo no puede estar vacía"),
  fileContent: z
    .string()
    .min(1, "El contenido del archivo no puede estar vacío"),
  branch: z
    .string()
    .optional()
    .default("main"),
});

// ─── close_issue ─────────────────────────────────────────────────────────────

export const closeIssueSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
  issue_number: z
    .number()
    .int("El número de issue debe ser un entero")
    .positive("El número de issue debe ser positivo"),
});

// ─── create_branch ───────────────────────────────────────────────────────────

export const createBranchSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
  branchName: z
    .string()
    .min(1, "El nombre de la branch no puede estar vacío")
    .max(255, "El nombre de la branch no puede superar 255 caracteres")
    .regex(/^[a-zA-Z0-9._/-]+$/, "Nombre de branch inválido"),
  fromBranch: z
    .string()
    .optional()
    .default("main"),
});

// ─── create_pull_request ─────────────────────────────────────────────────────

export const createPullRequestSchema = z.object({
  owner: ownerSchema,
  repo: repoSchema,
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(256, "El título no puede superar 256 caracteres"),
  body: z
    .string()
    .max(65536, "El cuerpo no puede superar 65536 caracteres")
    .optional()
    .default(""),
  head: z
    .string()
    .min(1, "La branch origen no puede estar vacía"),
  base: z
    .string()
    .optional()
    .default("main"),
  draft: z
    .boolean()
    .optional()
    .default(false),
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type ListRepositoriesInput = z.infer<typeof listRepositoriesSchema>;
export type ListIssuesInput = z.infer<typeof listIssuesSchema>;
export type ListCommitsInput = z.infer<typeof listCommitsSchema>;
export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type CreateCommitInput = z.infer<typeof createCommitSchema>;
export type CloseIssueInput = z.infer<typeof closeIssueSchema>;
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type CreatePullRequestInput = z.infer<typeof createPullRequestSchema>;