import UserController from "./user-controller";
import { UserDTO } from "./user-dto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/api-auth";
import bcrypt from "bcrypt";

const userController = new UserController();

export async function GET(request: NextRequest) {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const searchParams = request.nextUrl.searchParams;
    const reqEmail = searchParams.get("email");

    if (reqEmail) {
        try {
            const user = await userController.getUserByEmail(reqEmail);
            if (!user) {
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
    const { username, password }: { username: string; password: string } = await request.json();

    try {
        const user = await userController.getUserByEmail(username);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }, { status: 200 });

    } catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}