// src/tools/list-repositories.ts
import { z } from "zod";
import { obtenerRepositoriosUsuario } from "../GitHub/Operations.js";

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

export type ListRepositoriesInput = z.infer<typeof listRepositoriesSchema>;

export async function listRepositoriesTool(input: ListRepositoriesInput) {
  const parsed = listRepositoriesSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "), 
    };
  }

  const repos = await obtenerRepositoriosUsuario(parsed.data.username);

  return {
    error: false,
    count: repos.length,
    repositories: repos.map((repo) => ({
      id: repo.Id,
      name: repo.Name,
      fullName: repo.FullName,
      description: repo.Description,
      url: repo.HtmlUrl,
      language: repo.Lenguaje,
      stars: repo.StargazersCount,
      defaultBranch: repo.DefaultBranch,
      fork: repo.Fork,  // ------------> me indica si se han hecho copias en algun momento del repositorio, es decir, si es un fork o no, o si es un repositorio original
      createdAt: repo.CreatedAt,
      updatedAt: repo.UpdatedAt,
    })),
  };
}