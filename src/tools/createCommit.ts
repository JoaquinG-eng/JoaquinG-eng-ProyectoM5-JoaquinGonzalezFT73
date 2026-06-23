import { z } from "zod";
import { createCommitSchema, CreateCommitInput } from "../schemas/Schemas.js";
import { octokit } from "../GitHub/Clients.js";
import { logger } from "../utils/logging.js";
import { handleGitHubError } from "../GitHub/Operations.js";

export { createCommitSchema };

export async function createCommitTool(input: CreateCommitInput) {
  const parsed = createCommitSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: true,
      message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
  }

  const { owner, repo, message, filePath, fileContent, branch } = parsed.data;

  try {
    logger.info("Creando commit", { owner, repo, message, filePath, branch });

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

    logger.debug("Commit creado exitosamente", { owner, repo, sha: response.data.commit.sha });

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
  } catch (error) {
    logger.error("Error al crear commit", { owner, repo, message, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}