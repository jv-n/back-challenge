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
import { type Task, type User } from "@/form_schema"
import { Plus } from "lucide-react"

interface CreateTaskFormProps {
  user: User
  onCreateTask: (task: Task) => void
}

type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

export function CreateTaskForm({ user, onCreateTask }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    deadline: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    const newTask: Task = {
      title: form.title,
      description: form.description,
      status: "PENDING",
      priority: form.priority,
      deadline: form.deadline,
      user_id: user.id,
      user_name: user.name,
    }

    onCreateTask(newTask)
    setForm({ title: "", description: "", priority: "MEDIUM", deadline: "" })
    setOpen(false)
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
                <FieldLabel htmlFor="title">Título</FieldLabel>
                <Input
                  id="title"
                  placeholder="Digite o título da tarefa"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
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
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Tarefa</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
