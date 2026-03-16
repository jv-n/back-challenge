
"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { type UserInterface } from "@/lib/interfaces"

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionAny = session as any
  const user: UserInterface = {
    id: session.user?.id || sessionAny?.id || "",
    name: session.user?.name || sessionAny?.name || "",
    email: session.user?.email || sessionAny?.email || "",
    isAdmin: sessionAny?.role === "admin",
  }

  return <Dashboard user={user} onLogout={() => signOut({
     callbackUrl: "/"
  })} />
}
