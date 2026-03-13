import { PrismaClient } from '@prisma/client';
import { TaskDTO, UpdateTaskDTO } from "./task-dto";

const prisma = new PrismaClient();

export class TaskService {
    async createTask(data: TaskDTO) {
        return await prisma.task.create({ data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                deadline: new Date(data.deadline),
                created_at: new Date(data.created_at),
                file_url: data.file_url,
                userId: data.user_id,
                user:{
                    connect: { id: data.user_id }
                }
            }
          });
    }

    async getTasks() {
        return await prisma.task.findMany();
    }
    
    async getTaskById(id: string) {
        return await prisma.task.findUnique({ where: { id } });
    }

    async getTasksByUserId(userId: string) {
        return await prisma.task.findMany({ where: { userId } });
    }

    async updateTask(id: string, task: UpdateTaskDTO) {
        return await prisma.task.update({ where: { id }, data: task });
    }

    async deleteTask(id: string) {
        return await prisma.task.delete({ where: { id } });
    }
}