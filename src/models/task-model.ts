import { UserModel } from "./user-model";

export interface TaskModel {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "DONE";
    deadline: string;
    created_at: string;
    file_url?: string;
    user_id: string;
    user: UserModel;
}
