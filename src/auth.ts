import { type NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthConfig = {
    secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        password: credentials?.password,
                    }),
                });

                const user = await response.json();
                if (response.ok && user) {
                    return user;
                } else return null;
            },
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const userData = user as any;
                token.id = userData.id;
                token.name = userData.name;
                token.email = userData.email;
                token.role = userData.isAdmin ? "admin" : "user";
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session as any).role = token.role;
            }
            return session;
        },
    },
};

export const { auth, signIn, signOut, handlers } = NextAuth(nextAuthOptions);