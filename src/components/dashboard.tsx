"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { TaskCard } from "@/components/task-card"
import { CreateTaskForm } from "@/components/create-task-form"
import { StatsCards } from "@/components/stats-cards"
import { TaskFilters } from "@/components/task-filters"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import {
  type TaskStatus,
  type UserInterface,
  type TaskInterface,
} from "@/form_schema"
import { Users, ListTodo } from "lucide-react"

interface DashboardProps {
  user: UserInterface
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<TaskInterface[]>([])
  const [allUsers, setAllUsers] = useState<UserInterface[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const isAdmin = user.isAdmin

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      setError("")
      try {
        const response = await fetch("/api/task")
        if (!response.ok) {
          throw new Error("Falha ao carregar tarefas")
        }
        const data = await response.json()
        
        // Map API response to TaskInterface
        const mappedTasks: TaskInterface[] = data.map((task: {
          id: string
          title: string
          description: string
          status: TaskStatus
          priority: "LOW" | "MEDIUM" | "HIGH"
          deadline: string
          craeatedAt?: string
          created_at?: string
          userId: string
          user?: { name: string }
          fileUrl?: string
        }) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as TaskStatus,
          priority: task.priority,
          deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : "",
          created_at: task.craeatedAt || task.created_at || new Date().toISOString(),
          user_id: task.userId,
          user_name: task.user?.name || "Usuario",
          fileUrl: task.fileUrl,
        }))
        
        setTasks(mappedTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar tarefas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Fetch all users if admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const data = await response.json()
          setAllUsers(data)
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }

    fetchUsers()
  }, [isAdmin])

  // Filter tasks based on user role
  const userTasks = useMemo(() => {
    if (isAdmin) return tasks
    return tasks.filter((task) => task.user_id === user.id)
  }, [tasks, user.id, isAdmin])

  // Apply search and status filters
  const filteredTasks = useMemo(() => {
    return userTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        task.user_name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [userTasks, search, statusFilter])

  // Group tasks by user for admin view
  const tasksByUser = useMemo(() => {
    if (!isAdmin) return {}
    const grouped: Record<string, { user: UserInterface; tasks: TaskInterface[] }> = {}
    filteredTasks.forEach((task) => {
      if (!grouped[task.user_id]) {
        const taskUser = allUsers.find((u) => u.id === task.user_id)
        grouped[task.user_id] = {
          user: taskUser || { id: task.user_id, name: task.user_name, email: "", isAdmin: false },
          tasks: [],
        }
      }
      grouped[task.user_id].tasks.push(task)
    })
    return grouped
  }, [filteredTasks, isAdmin, allUsers])

  const handleCreateTask = (newTask: TaskInterface) => {
    setTasks((prev) => [newTask, ...prev])
  }

  const handleUpdateTask = async (id: string, updates: Partial<TaskInterface>) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updates,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar tarefa")
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      )
    } catch (err) {
      console.error("Error updating task:", err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/task/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir tarefa")
      }

      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      console.error("Error deleting task:", err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="h-8 w-8" />
            <p className="text-muted-foreground">Carregando tarefas...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={onLogout} />
        <main className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary underline"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={onLogout} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdmin ? "Painel Administrativo" : `Ola, ${user.name?.split(" ")[0] || "Usuario"}!`}
            </h1>
            <p className="text-muted-foreground">
              {isAdmin
                ? "Gerencie todas as tarefas do sistema"
                : "Gerencie suas tarefas pessoais"}
            </p>
          </div>
          <CreateTaskForm 
            user={user} 
            onCreateTask={handleCreateTask}
            allUsers={allUsers}
            isAdmin={isAdmin}
          />
        </div>

        {/* Stats */}
        <StatsCards tasks={userTasks} />

        {/* Filters */}
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Tasks */}
        {isAdmin ? (
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <ListTodo className="h-4 w-4" />
                Todas as Tarefas
              </TabsTrigger>
              <TabsTrigger value="by-user" className="gap-2">
                <Users className="h-4 w-4" />
                Por Usuario
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma tarefa encontrada
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleUpdateTask}
                      onDelete={handleDeleteTask}
                      canEdit={true}
                      showOwner={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="by-user" className="space-y-6">
              {Object.entries(tasksByUser).map(([userId, { user: taskUser, tasks: userTaskList }]) => (
                <div key={userId} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {taskUser.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <h3 className="font-semibold text-foreground">{taskUser.name}</h3>
                    <Badge variant="secondary">{userTaskList.length} tarefas</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {userTaskList.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                        canEdit={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(tasksByUser).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma tarefa encontrada
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {userTasks.length === 0
                  ? "Voce ainda nao tem tarefas. Crie sua primeira tarefa!"
                  : "Nenhuma tarefa encontrada com os filtros aplicados"}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    canEdit={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}