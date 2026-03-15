"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, LogIn, UserPlus, ArrowLeft } from "lucide-react"

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setIsAdmin(false)
    setError("")
    setSuccess("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciais invalidas. Verifique seu email e senha.")
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!name.trim()) {
      setError("Por favor, informe seu nome")
      setIsLoading(false)
      return
    }

    if (!email.trim()) {
      setError("Por favor, informe seu email")
      setIsLoading(false)
      return
    }

    if (!password.trim() || password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          isAdmin: isAdmin,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Erro ao criar conta")
        setIsLoading(false)
        return
      }

      setSuccess("Conta criada com sucesso! Fazendo login...")

      // Auto login after registration
      setTimeout(async () => {
        const result = await signIn("credentials", {
          username: email.trim(),
          password: password.trim(),
          redirect: false,
        })

        if (result?.error) {
          setError("Conta criada, mas erro ao fazer login automatico. Tente fazer login manualmente.")
        }
        setIsLoading(false)
      }, 1000)
    } catch {
      setError("Erro ao criar conta. Tente novamente.")
      setIsLoading(false)
    }
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </Field>
              </FieldGroup>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Checkbox
                  id="isAdmin"
                  checked={isAdmin}
                  onCheckedChange={(checked) => setIsAdmin(checked === true)}
                  disabled={isLoading}
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => switchMode("login")}
                disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => switchMode("register")}
              disabled={isLoading}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Criar nova conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
