import { z } from "zod";
import { GitHubIssues } from "../GitHub/Operations.js";

export const listIssuesSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner no puede estar vacío")
    .max(40, "El owner no puede superar 40 caracteres"),
  repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
});

export type ListIssuesInput = z.infer<typeof listIssuesSchema>;

export async function listIssuesTool(input: ListIssuesInput) {
  const parsed = listIssuesSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const issues = await GitHubIssues(parsed.data.owner, parsed.data.repo);

  return {
    error: false,
    count: issues.length,
    issues: issues.map((issue) => ({
      id: issue.Id,
      title: issue.Title,
      estado: issue.Estado,
      usuario: issue.Usuario,
      url: issue.Url,
      createdAt: issue.CreatedAt,
      updatedAt: issue.UpdatedAt,
    })),
  };
}