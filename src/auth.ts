import { type NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const nextAuthOptions: NextAuthConfig = {
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
                token.user = user; // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).isAdmin ? "admin" : "user";
            }
            return token;
        },

        async session({ session, token }) {         // eslint-disable-next-line @typescript-eslint/no-explicit-any
            session = token.user as any;
            session.role = token.role as "admin" | "user";
            return session;
        },
    },
};

export const { auth, signIn, signOut } = NextAuth(nextAuthOptions);
