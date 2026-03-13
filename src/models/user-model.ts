import { TaskModel } from "./task-model";

export interface UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    tasks: TaskModel[];
}