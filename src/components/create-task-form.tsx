"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { type UserInterface, type TaskInterface, type TaskPriority } from "@/form_schema"
import { Plus, Loader2 } from "lucide-react"

interface CreateTaskFormProps {
  user: UserInterface
  onCreateTask: (task: TaskInterface) => void
}

export function CreateTaskForm({ user, onCreateTask }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    deadline: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          priority: form.priority,
          status: "PENDING",
          deadline: form.deadline,
          userId: user.id,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar tarefa")
      }

      const newTask = await response.json()
      
      // Map API response to TaskInterface
      const mappedTask: TaskInterface = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        deadline: newTask.deadline,
        created_at: newTask.craeatedAt || newTask.created_at,
        user_id: newTask.userId,
        user_name: user.name,
      }

      onCreateTask(mappedTask)
      setForm({ title: "", description: "", priority: "MEDIUM", deadline: "" })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Tarefa</DialogTitle>
            <DialogDescription>
              Preencha os dados da tarefa abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Titulo</FieldLabel>
                <Input
                  id="title"
                  placeholder="Digite o titulo da tarefa"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descricao</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="Descreva a tarefa"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Prioridade</FieldLabel>
                  <Select
                    value={form.priority}
                    onValueChange={(value: TaskPriority) => setForm({ ...form, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Baixa</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="deadline">Vencimento</FieldLabel>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  />
                </Field>
              </div>
            </FieldGroup>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg mt-4">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Tarefa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
