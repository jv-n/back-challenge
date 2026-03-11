import * as z from "zod";

export const TaskSchema = z.object({
    title: z.string().min(1, "Insira um título para a tarefa"),
    description: z.string().min(1, "Insira uma descrição para a tarefa"),
    deadline: z.iso.date({message: "Insira uma data válida para o prazo da tarefa"}),
    status: z.enum(["PENDING", "IN_PROGRESS", "DONE"], {message: "Status inválido, escolha entre 'pendente', 'em andamento' ou 'concluída'"}),
})

export type Task = z.infer<typeof TaskSchema>;