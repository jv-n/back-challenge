import { PrismaClient } from '@prisma/client';
import { TaskDTO, UpdateTaskDTO } from "./task-dto";
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL!,
});

export class TaskService {
    private prisma: PrismaClient;
    
    constructor() {
        this.prisma = new PrismaClient({ adapter });
    }

    async createTask(data: TaskDTO) {
        return await this.prisma.task.create({ data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                deadline: new Date(data.deadline),
                fileUrl: data.fileUrl,
                user:{
                    connect: { id: data.userId }
                }
            }
          });
    }

    async getTasks() {
        return await this.prisma.task.findMany();
    }
    
    async getTaskById(id: string) {
        return await this.prisma.task.findUnique({ where: { id } });
    }

    async getTasksByUserId(userId: string) {
        return await this.prisma.task.findMany({ where: { userId }, include: { user: true } });
    }

    async updateTask(id: string, data: UpdateTaskDTO) {
        return await this.prisma.task.update({ where: { id }, 
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority,
                status: data.status,
                deadline: data.deadline ? new Date(data.deadline) : undefined,
                fileUrl: data.fileUrl, 
            } 
        });
    }

    async deleteTask(id: string) {
        return await this.prisma.task.delete({ where: { id } });
    }
}