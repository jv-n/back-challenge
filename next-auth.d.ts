// next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        id: string;
        role: "admin" | "user";
        accessToken?: string;
    }

    interface JWT extends DefaultJWT {
        id: string;
        username: string;
        role: "admin" | "user";
    }
}