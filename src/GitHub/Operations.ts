import type { GitHubRepositorio, informacionUsuario, GitHubCommitDetallado, GitHubIssues, GitHubPullRequest, GitHubToolError } from "../types";
import { octokit } from "./Clients.js";
import { withRetry } from "../utils/retry.js";
import { logger } from "../utils/logging.js";


export async function obtenerRepositoriosUsuario(
  username: string
): Promise<GitHubRepositorio[]> {
  logger.info("Obteniendo repositorios", { username });
  try {
    const response = await withRetry(() =>
      octokit.repos.listForUser({ username, per_page: 100 })
    );
    logger.debug("Repositorios obtenidos", { username, count: response.data.length });
    return response.data.map((repo): GitHubRepositorio => ({
      Id: repo.id,
      Name: repo.name,
      FullName: repo.full_name,
      Dueño: {
        Login: repo.owner?.login ?? "",
        Id: repo.owner?.id ?? 0,
        FotoUrl: repo.owner?.avatar_url ?? "",
        HtmlUrl: repo.owner?.html_url ?? "",
      },
      DefaultBranch: repo.default_branch ?? "",
      HtmlUrl: repo.html_url,
      Description: repo.description ?? "",
      Fork: repo.fork,
      Url: repo.url,
      CreatedAt: repo.created_at ?? "",
      UpdatedAt: repo.updated_at ?? "",
      PushedAt: repo.pushed_at ?? "",
      StargazersCount: repo.stargazers_count ?? 0,
      WatchersCount: repo.watchers_count ?? 0,
      Lenguaje: repo.language ?? "",
    }));
  } catch (error) {
    logger.error("Error al obtener repositorios", { username, error });
    throw handleGitHubError(error, username);
  }
}


export async function obtenerInformacionUsuario(
  username: string
): Promise<informacionUsuario> {
  logger.info("Obteniendo información del usuario", { username });
  try {
    const response = await withRetry(() =>
      octokit.users.getByUsername({ username })
    );
    logger.debug("Información del usuario obtenida", { username });
    const user = response.data;
    return {
      Login: user.login,
      Id: user.id,
      HtmlUrl: user.html_url,
      Name: user.name ?? "",
      Company: user.company ?? "",
      Blog: user.blog ?? "",
      Location: user.location ?? "",
      Email: user.email ?? "",
      Bio: user.bio ?? "",
      PublicRepos: user.public_repos,
      Followers: user.followers,
      Following: user.following,
      CreatedAt: user.created_at,
      UpdatedAt: user.updated_at,
    };
  } catch (error) {
    logger.error("Error al obtener información del usuario", { username, error });
    throw handleGitHubError(error, username);
  }
}


export async function GitHubCommitDetallado(
  owner: string,
  repo: string
): Promise<GitHubCommitDetallado[]> {
  logger.info("Obteniendo commits", { owner, repo });
  try {
    const response = await withRetry(() =>
      octokit.repos.listCommits({ owner, repo, per_page: 100 })
    );
    logger.debug("Commits obtenidos", { owner, repo, count: response.data.length });
    return response.data.map((commit): GitHubCommitDetallado => ({
      sha: commit.sha,
      name: commit.commit.author?.name ?? "",
      message: commit.commit.message,
      athor: {
        name: commit.commit.author?.name ?? "",
        email: commit.commit.author?.email ?? "",
        date: commit.commit.author?.date ?? "",
      },
      url: commit.html_url,
    }));
  } catch (error) {
    logger.error("Error al obtener commits", { owner, repo, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}


export async function GitHubIssues(
  owner: string,
  repo: string
): Promise<GitHubIssues[]> {
  logger.info("Obteniendo issues", { owner, repo });
  try {
    const response = await withRetry(() =>
      octokit.issues.listForRepo({ owner, repo, per_page: 100 })
    );
    logger.debug("Issues obtenidos", { owner, repo, count: response.data.length });
    return response.data.map((issue): GitHubIssues => ({
      Id: issue.id,
      Title: issue.title,
      Estado: issue.state === "open" ? "Abierto" : "Cerrado",
      Usuario: issue.user?.login ?? "",
      Url: issue.html_url,
      CreatedAt: issue.created_at,
      UpdatedAt: issue.updated_at,
    }));
  } catch (error) {
    logger.error("Error al obtener issues", { owner, repo, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}


export async function GitHubPullRequests(
  owner: string,
  repo: string,
): Promise<GitHubPullRequest[]> {
  logger.info("Obteniendo pull requests", { owner, repo });
  try {
    const response = await withRetry(() =>
      octokit.pulls.list({ owner, repo, per_page: 100 })
    );
    logger.debug("Pull requests obtenidos", { owner, repo, count: response.data.length });
    return response.data.map((pr): GitHubPullRequest => ({
      id: pr.number,
      title: pr.title,
      description: pr.body ?? "",
      status: pr.draft ? "draft" : pr.state === "closed"
        ? (pr.merged_at ? "merged" : "closed")
        : "open",
      author: {
        id: pr.user?.id ?? 0,
        username: pr.user?.login ?? "",
        avatarUrl: pr.user?.avatar_url ?? "",
      },
      sourceBranch: pr.head.ref,
      targetBranch: pr.base.ref,
      url: pr.html_url,
      repositoryName: pr.base.repo.name,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      isDraft: pr.draft ?? false,
    }));
  } catch (error) {
    logger.error("Error al obtener pull requests", { owner, repo, error });
    throw handleGitHubError(error, `${owner}/${repo}`);
  }
}


export function handleGitHubError(error: unknown, resourceName?: string): GitHubToolError {
  if (error instanceof Error) {
    const message = error.message;
    const status = (error as any).status;

    if (status === 401) {
      return {
        message: "No se pudo autenticar con GitHub. Verificá que tu token sea válido y no haya expirado.",
        documentationUrl: "https://docs.github.com/rest/overview/authenticating-to-the-rest-api",
        code: "AUTHENTICATION_ERROR",
      };
    }
    if (status === 404) {
      return {
        message: resourceName
          ? `No se encontró '${resourceName}'. Verificá que el nombre sea correcto e intentá de nuevo.`
          : "El recurso solicitado no fue encontrado en GitHub. Verificá los datos ingresados.",
        documentationUrl: "https://docs.github.com/rest",
        code: "NotFound",
      };
    }
    if (status === 422) {
      return {
        message: `Los datos ingresados no son válidos. ${message}`,
        documentationUrl: "https://docs.github.com/rest",
        code: "ValidationFailed",
      };
    }
    if (status === 429) {
      return {
        message: "Se alcanzó el límite de solicitudes a GitHub. Esperá unos minutos e intentá de nuevo.",
        documentationUrl: "https://docs.github.com/rest/overview/rate-limits-for-the-rest-api",
        code: "RATE_LIMIT_EXCEEDED",
      };
    }
    if (status >= 500) {
      return {
        message: "GitHub está experimentando problemas. Intentá de nuevo en unos minutos.",
        documentationUrl: "https://docs.github.com/rest",
        code: "ServerError",
      };
    }

    return {
      message: `Ocurrió un error inesperado: ${message}`,
      documentationUrl: "https://docs.github.com/rest",
      code: "UNKNOWN_ERROR",
    };
  }

  return {
    message: "Ocurrió un error desconocido. Intentá de nuevo.",
    documentationUrl: "https://docs.github.com/rest",
    code: "UNKNOWN_ERROR",
  };
}