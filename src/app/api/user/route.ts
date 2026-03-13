import UserController from "./user-controller";
import { UserDTO } from "./user-dto";
import { NextRequest, NextResponse } from "next/server";

const userController = new UserController();

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const reqEmail = searchParams.get("email");
    if(reqEmail) {
        try {
            const user = await userController.getUserByEmail(reqEmail);
            if(!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }
            return NextResponse.json(user, { status: 200 });
        } catch (error) {
            console.error("Error fetching user by email:", error);
            return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
        }
    }
    try {
        const users = await userController.getUsers();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const data : UserDTO = await request.json();
    
    try {
        const newUser = await userController.createUser(data);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}