import { UpdateTaskDTO } from "../task-dto";
import TaskController from "../task-controller";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

const taskController = new TaskController();

export async function GET( request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if(!id) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const task = await taskController.getTaskById(id);

    if(!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (session!.role !== "admin" && task.userId !== session!.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        return NextResponse.json(task, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    if(!id) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const existingTask = await taskController.getTaskById(id);
    if(!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (session!.role !== "admin" && existingTask.userId !== session!.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const data: UpdateTaskDTO = await request.json();
        const updatedTask = await taskController.updateTask(id, data);
        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;
    if(!id) {
        return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const existingTask = await taskController.getTaskById(id);
    if(!existingTask) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (session!.role !== "admin" && existingTask.userId !== session!.id) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        await taskController.deleteTask(id);
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
