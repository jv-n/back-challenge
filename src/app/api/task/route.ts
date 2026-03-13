import { NextRequest, NextResponse } from "next/server";
import TaskController from "./task-controller";
import { TaskDTO } from "./task-dto";

const taskController = new TaskController();

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get("userId");
    if(queryUserId) {
        try {
            const tasks = await taskController.getTasksByUserId(queryUserId);
            return NextResponse.json(tasks, { status: 200 });
        } catch (error) {
            console.error("Error fetching tasks by user ID:", error);
            return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
        }
    }

    try{
        const tasks = await taskController.getTasks();
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const data : TaskDTO = await request.json();
    
    try {
        const newTask = await taskController.createTask(data);
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}