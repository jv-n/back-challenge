"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { mockUsers, type User, type UserInterface } from "@/schema"
import { CheckSquare, LogIn, UserPlus, ArrowLeft } from "lucide-react"

interface LoginFormProps {
  onLogin: (user: UserInterface) => void
  onRegister: (user: User) => void
}

export function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setIsAdmin(false)
    setError("")
    setSuccess("")
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      onLogin(user)
    } else {
      setError("Usuario nao encontrado. Tente: maria@email.com, joao@email.com ou admin@email.com")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Por favor, informe seu nome")
      return
    }
    
    if (!email.trim()) {
      setError("Por favor, informe seu email")
      return
    }
    
    if (!password.trim() || password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setError("Este email ja esta cadastrado")
      return
    }

    const newUser: User = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      isAdmin: isAdmin
    }

    mockUsers.push({
      id: `user-${mockUsers.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      isAdmin: newUser.isAdmin
    })
    onRegister(newUser)
    setSuccess("Conta criada com sucesso!")
    
    setTimeout(() => {
      onLogin({
        id: `user-${mockUsers.length}`,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      })
    }, 1000)
  }

  const handleQuickLogin = (user: UserInterface) => {
    onLogin(user)
  }

  const switchMode = (newMode: "login" | "register") => {
    resetForm()
    setMode(newMode)
  }

  if (mode === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <CheckSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold">TaskFlow</CardTitle>
            </div>
            <CardDescription>
              Crie sua conta para comecar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome completo</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      setError("")
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimo 6 caracteres"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                  />
                </Field>
              </FieldGroup>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked === true)}
                />
                <div className="flex-1">
                  <label htmlFor="isAdmin" className="text-sm font-medium cursor-pointer">
                    Criar como Administrador
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Administradores podem ver e gerenciar tarefas de todos os usuarios
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{success}</p>
              )}

              <Button type="submit" className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Criar conta
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => switchMode("login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ja tenho uma conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <CheckSquare className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">TaskFlow</CardTitle>
          </div>
          <CardDescription>
            Sistema de gerenciamento de tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Entrar
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => switchMode("register")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Criar nova conta
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Acesso rapido para demonstracao:
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleQuickLogin(mockUsers[0])}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    M
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Maria Silva</p>
                    <p className="text-xs text-muted-foreground">Usuario padrao</p>
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleQuickLogin(mockUsers[1])}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    J
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Joao Santos</p>
                    <p className="text-xs text-muted-foreground">Usuario padrao</p>
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-primary/30 bg-primary/5"
                onClick={() => handleQuickLogin(mockUsers[2])}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                    A
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">Administrador - ve todas as tarefas</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
