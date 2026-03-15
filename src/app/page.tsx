
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { type UserInterface } from "@/form_schema"

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginForm />
  }

  const user: UserInterface = {
    id: (session.user as { id?: string })?.id || session.id as string || "",
    name: session.user?.name || "",
    email: session.user?.email || "",
    isAdmin: (session.user as { role?: string })?.role === "admin" || session.role === "admin",
  }

  return <Dashboard user={user} onLogout={() => signOut()} />
}
