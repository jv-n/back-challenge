import { UserModel } from "@/models/user-model";

export type TaskDTO = {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    deadline: string;
    fileUrl?: string;
    userId: string;
    user: UserModel
};

export type UpdateTaskDTO = {
    title?: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    status?: "PENDING" | "IN_PROGRESS" | "DONE";
    deadline?: string;
    fileUrl?: string;
};

