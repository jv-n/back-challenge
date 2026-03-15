// lib/api-auth.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
    const session = await auth();

    if (!session) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    return { session };
}

export async function requireAdmin() {
    const { session, error } = await requireAuth();

    if (error) return { error };

    if (session!.role !== "admin") {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }

    return { session };
}