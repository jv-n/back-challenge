import { TaskService } from "./task-service";
import { TaskDTO, UpdateTaskDTO } from "./task-dto";

class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    async createTask(data: TaskDTO) {
        return await this.taskService.createTask(data);
    }

    async getTasks() {
        return await this.taskService.getTasks();
    }
    
    async getTaskById(id: number) {
        return await this.taskService.getTaskById(id);
    }

    async getTasksByUserId(userId: number) {
        return await this.taskService.getTasksByUserId(userId);
    }

    async updateTask(id: number, task: UpdateTaskDTO) {
        return await this.taskService.updateTask(id, task);
    }

    async deleteTask(id: number) {
        return await this.taskService.deleteTask(id);
    }
}

export default TaskController;