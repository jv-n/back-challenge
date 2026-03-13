import { TaskModel } from "@/models/task-model";

export type TaskDTO = TaskModel;

export type UpdateTaskDTO = Partial<TaskModel>;

