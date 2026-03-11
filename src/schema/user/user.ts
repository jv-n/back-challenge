import * as z from "zod";

export const UserSchema = z.object({
    name: z.string().min(1, "Insira um nome para o usuário"),
    email: z.email("Insira um email válido para o usuário"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres")
    .regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)\w$/, "A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial")
    .max(18, "A senha deve conter no máximo 18 caracteres"),
    isAdmin: z.boolean().default(false)
})

export type User = z.infer<typeof UserSchema>;