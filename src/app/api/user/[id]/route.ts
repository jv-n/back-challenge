import { NextRequest, NextResponse } from "next/server";
import UserController from "../user-controller";
import { UpdateUserDTO } from "../user-dto";
import { requireAuth } from "@/lib/api-auth";

const userController = new UserController();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (session!.role !== "admin" && session!.id !== id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const user = await userController.getUserById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (session!.id !== id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const existingUser = await userController.getUserById(id);
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const data: UpdateUserDTO = await request.json();

        if ("isAdmin" in data) {
            return NextResponse.json({ error: "Cannot change admin status" }, { status: 403 });
        }

        const updatedUser = await userController.updateUser(id, data);
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (session!.id !== id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {       
        await userController.deleteUser(id);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}