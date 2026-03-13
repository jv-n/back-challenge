
import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { type User, type UserInterface } from "@/form_schema"

export default function Home() {
  const [userLogin, setUserLogin] = useState<UserInterface | null>(null)
  const [newUser, setNewUser] = useState<User | null>(null)

  if (!userLogin) {
    return <LoginForm onLogin={setUserLogin} onRegister={setNewUser} />
  }

  return <Dashboard user={userLogin} onLogout={() => setUserLogin(null)} />
}
