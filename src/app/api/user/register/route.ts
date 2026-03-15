// app/api/users/register/route.ts  → public (or admin-only, your choice)
import UserController from "../user-controller";
import { UserDTO } from "../user-dto";
import { NextRequest, NextResponse } from "next/server";

const userController = new UserController();

export async function POST(request: NextRequest) {
    const data: UserDTO = await request.json();

    try {
        const newUser = await userController.createUser(data);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}