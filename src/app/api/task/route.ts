import { NextRequest, NextResponse } from "next/server";
import TaskController from "./task-controller";
import { TaskDTO } from "./task-dto";

const taskController = new TaskController();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user_id = searchParams.get("userId");

    if (id) {
        const task = await taskController.getTaskById(Number(id));
        return NextResponse.json(task);
    } else if (user_id) {
        const tasks = await taskController.getTasksByUserId(Number(user_id));
        return NextResponse.json(tasks);
    } else {
        const tasks = await taskController.getTasks();
        return NextResponse.json(tasks);
    }
}

export async function POST(request: NextRequest) {
    const data : TaskDTO = await request.json();
    const newTask = await taskController.createTask(data);
    return NextResponse.json(newTask);
}