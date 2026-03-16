"use client"

import { useState, useRef } from "react"
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
import { Plus, Loader2, Upload, X, FileIcon } from "lucide-react"

interface CreateTaskFormProps {
  user: UserInterface
  onCreateTask: (task: TaskInterface) => void
  allUsers?: UserInterface[]
  isAdmin?: boolean
}

export function CreateTaskForm({ user, onCreateTask, allUsers = [], isAdmin = false }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [assigneeId, setAssigneeId] = useState<string>(user.id)
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as TaskPriority,
    deadline: "",
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("O arquivo deve ter no maximo 10MB")
        return
      }
      setSelectedFile(file)
      setUploadedFileUrl(null)
      setError("")
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadedFileUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Falha ao fazer upload do arquivo")
      }

      const data = await response.json()
      setUploadedFileUrl(data.url)
      return data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload")
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Upload file first if selected
      let fileUrl = uploadedFileUrl
      if (selectedFile && !uploadedFileUrl) {
        fileUrl = await uploadFile()
        if (selectedFile && !fileUrl) {
          setIsLoading(false)
          return // Error already set by uploadFile
        }
      }

      // Determine the assignee (either selected user for admin, or current user)
      const assignee = isAdmin && assigneeId !== user.id
        ? allUsers.find(u => u.id === assigneeId) || user
        : user

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
          fileUrl: fileUrl || undefined,
          userId: assignee.id,
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
        user_name: assignee.name,
        fileUrl: newTask.fileUrl,
      }

      onCreateTask(mappedTask)
      setForm({ title: "", description: "", priority: "MEDIUM", deadline: "" })
      setSelectedFile(null)
      setUploadedFileUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar tarefa")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Reset form when dialog closes
      setForm({ title: "", description: "", priority: "MEDIUM", deadline: "" })
      setSelectedFile(null)
      setUploadedFileUrl(null)
      setAssigneeId(user.id)
      setError("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
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
              {isAdmin && allUsers.length > 0 && (
                <Field>
                  <FieldLabel>Atribuir para</FieldLabel>
                  <Select
                    value={assigneeId}
                    onValueChange={setAssigneeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} {u.isAdmin && "(Admin)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
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
              <Field>
                <FieldLabel>Arquivo (opcional)</FieldLabel>
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, imagens, documentos (max 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                    <FileIcon className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                        {uploadedFileUrl && " - Enviado"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Field>
            </FieldGroup>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg mt-4">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || isUploading}>
              {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Enviando arquivo..." : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}