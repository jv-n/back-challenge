//Would task need a get user? it coould use a userId to get the user info if needed, 
// but it might be more efficient to just include the user info in the task when fetching tasks. 
import { NextRequest, NextResponse } from "next/server";
import UserController from "../user-controller";
import { UpdateUserDTO } from "../user-dto";

const userController = new UserController();

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if(!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }  

    const user = await userController.getUserById(id);

    if(!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if(!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    const existingUser = await userController.getUserById(id);
    if(!existingUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    try {
        const data: UpdateUserDTO = await request.json();
        const updatedUser = await userController.updateUser(id, data);
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}