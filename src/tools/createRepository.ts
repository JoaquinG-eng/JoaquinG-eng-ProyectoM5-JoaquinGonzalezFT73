import { z } from "zod";
import { octokit } from "../GitHub/Clients.js";

export const createRepositorySchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 1 caracteres")
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

export type CreateRepositoryInput = z.infer<typeof createRepositorySchema>;

export async function createRepositoryTool(input: CreateRepositoryInput) {
  const parsed = createRepositorySchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const response = await octokit.repos.createForAuthenticatedUser({
    name: parsed.data.name,
    description: parsed.data.description,
    private: parsed.data.isPrivate,
    auto_init: true,
  });

  return {
    error: false,
    repository: {
      id: response.data.id,
      name: response.data.name,
      fullName: response.data.full_name,
      url: response.data.html_url,
      private: response.data.private,
      description: response.data.description ?? "",
      createdAt: response.data.created_at,
    },
  };
}