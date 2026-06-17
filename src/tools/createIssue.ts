import { z } from "zod";
import { octokit } from "../GitHub/Clients.js";

export const createIssueSchema = z.object({
owner: z
    .string()
    .min(1, "El campo no puede estar vacío")
    .max(39, "El campo no puede superar 39 caracteres"),
repo: z
    .string()
    .min(3, "El nombre del repositorio debe tener al menos 3 caracteres")
    .max(100, "El nombre del repositorio no puede superar 100 caracteres")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Nombre de repositorio inválido"),
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

export type CreateIssueInput = z.infer<typeof createIssueSchema>;

export async function createIssueTool(input: CreateIssueInput) {
const parsed = createIssueSchema.safeParse(input);

if (!parsed.success) {
    return {
        error: true,
        message: parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", "),
    };
}

const response = await octokit.issues.create({
    owner: parsed.data.owner,
    repo: parsed.data.repo,
    title: parsed.data.title,
    body: parsed.data.body,
});

return {
    error: false,
    issue: {
        id: response.data.id,
        number: response.data.number,
        title: response.data.title,
        body: response.data.body ?? "",
        state: response.data.state,
        url: response.data.html_url,
        createdAt: response.data.created_at,
},
};
}