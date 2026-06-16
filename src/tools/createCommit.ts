import { z } from "zod";
import { octokit } from "../GitHub/Clients.js";

export const createCommitSchema = z.object({
  owner: z
    .string()
    .min(1, "El owner no puede estar vacío")
    .max(39, "El owner no puede superar 39 caracteres"),
  repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
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

export type CreateCommitInput = z.infer<typeof createCommitSchema>;

export async function createCommitTool(input: CreateCommitInput) {
  const parsed = createCommitSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, message, filePath, fileContent, branch } = parsed.data;

  // Verificar si el archivo ya existe para obtener su SHA
  let fileSha: string | undefined;
  try {
    const existing = await octokit.repos.getContent({ owner, repo, path: filePath, ref: branch });
    if (!Array.isArray(existing.data) && existing.data.type === "file") {
      fileSha = existing.data.sha;
    }
  } catch {
    // El archivo no existe, se creará nuevo
  }

  const response = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message,
    content: Buffer.from(fileContent).toString("base64"),
    branch,
    ...(fileSha ? { sha: fileSha } : {}),
  });

  return {
    error: false,
    commit: {
      sha: response.data.commit.sha,
      message: response.data.commit.message,
      url: response.data.commit.html_url,
      filePath,
      fileUrl: response.data.content?.html_url ?? "",
    },
  };
}