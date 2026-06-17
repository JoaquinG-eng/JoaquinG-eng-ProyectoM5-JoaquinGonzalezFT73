import { z } from "zod";
import { GitHubCommitDetallado } from "../GitHub/Operations.js";

export const listCommitsSchema = z.object({
  owner: z
    .string()
    .min(1, "El campo no puede estar vacío")
    .max(39, "El campo no puede superar 39 caracteres"),
  repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
});

export type ListCommitsInput = z.infer<typeof listCommitsSchema>;

export async function listCommitsTool(input: ListCommitsInput) {
  const parsed = listCommitsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const commits = await GitHubCommitDetallado(parsed.data.owner, parsed.data.repo);

  return {
    error: false,
    count: commits.length,
    commits: commits.map((commit) => ({
      sha: commit.sha,
      message: commit.message,
      author: commit.athor.name,
      date: commit.athor.date,
      url: commit.url,
    })),
  };
}