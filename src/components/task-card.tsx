"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { type TaskInterface, type TaskStatus, type TaskPriority } from "@/lib/interfaces"
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  User,
  AlertCircle,
  CheckCircle2,
  Circle,
  FileIcon,
  ExternalLink,
} from "lucide-react"

interface TaskCardProps {
  task: TaskInterface
  onUpdate: (id: string, updates: Partial<TaskInterface>) => void
  onDelete: (id: string) => void
  canEdit: boolean
  showOwner?: boolean
}

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; className: string }> = {
  PENDING: {
    label: "Pendente",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  IN_PROGRESS: {
    label: "Em andamento",
    icon: Clock,
    className: "bg-primary/10 text-primary",
  },
  DONE: {
    label: "Concluída",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700",
  },
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: "Baixa", className: "bg-muted text-muted-foreground" },
  MEDIUM: { label: "Média", className: "bg-amber-100 text-amber-700" },
  HIGH: { label: "Alta", className: "bg-red-100 text-red-700" },
}

export function TaskCard({ task, onUpdate, onDelete, canEdit, showOwner = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    deadline: task.deadline || "",
  })

  const StatusIcon = statusConfig[task.status].icon

  const handleSave = () => {
    onUpdate(task.id, editForm)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setIsDeleting(false)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "DONE"

  return (
    <>
      <Card className={`group transition-all hover:shadow-md ${task.status === "DONE" ? "opacity-75" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-foreground truncate ${task.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              {showOwner && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {task.user_name}
                </div>
              )}
            </div>
            {canEdit && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setIsDeleting(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={statusConfig[task.status].className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[task.status].label}
            </Badge>
            <Badge variant="secondary" className={priorityConfig[task.priority].className}>
              {priorityConfig[task.priority].label}
            </Badge>
          </div>
          {task.deadline && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
              {isOverdue ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              {isOverdue ? "Atrasada: " : "Vencimento: "}
              {formatDate(task.deadline)}
            </div>
          )}
          {task.fileUrl && (
            <a
              href={task.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <FileIcon className="h-3 w-3" />
              Arquivo anexo
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Faca as alteracoes necessarias na tarefa.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-title">Titulo</FieldLabel>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-description">Descricao</FieldLabel>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={editForm.status}
                  onValueChange={(value: TaskStatus) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em andamento</SelectItem>
                    <SelectItem value="DONE">Concluida</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Prioridade</FieldLabel>
                <Select
                  value={editForm.priority}
                  onValueChange={(value: TaskPriority) => setEditForm({ ...editForm, priority: value })}
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
            </div>
            <Field>
              <FieldLabel htmlFor="edit-deadline">Data de vencimento</FieldLabel>
              <Input
                id="edit-deadline"
                type="date"
                value={editForm.deadline}
                onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a tarefa &quot;{task.title}&quot;? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
