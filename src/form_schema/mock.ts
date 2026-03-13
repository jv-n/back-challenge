
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE"
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

// Interface represents the model in database 

export interface UserInterface {
  id: string
  name: string
  email: string
  password?: string
  isAdmin: boolean
} 

export interface TaskInterface {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string
  created_at: string
  user_id: string
  user_name: string
}

// Mock users for texting
export const mockUsers: UserInterface[] = [
  { id: "user-1", name: "Maria Silva", email: "maria@email.com", password: "123456", isAdmin: false },
  { id: "user-2", name: "João Santos", email: "joao@email.com", password: "123456", isAdmin: false },
  { id: "admin-1", name: "Admin", email: "admin@email.com", password: "123456", isAdmin: true },
]

// Initial mock tasks
export const initialTasks: TaskInterface[] = [
  {
    id: "task-1",
    title: "Finalizar relatório mensal",
    description: "Completar o relatório de vendas do mês de fevereiro",
    status: "IN_PROGRESS",
    priority: "HIGH",
    deadline: "2026-03-15",
    created_at: "2026-03-01T10:00:00Z",
    user_id: "user-1",
    user_name: "Maria Silva",
  },
  {
    id: "task-2",
    title: "Revisar documentação do projeto",
    description: "Atualizar a documentação técnica do sistema",
    status: "PENDING",
    priority: "MEDIUM",
    deadline: "2026-03-20",
    created_at: "2026-03-02T14:30:00Z",
    user_id: "user-1",
    user_name: "Maria Silva",
  },
  {
    id: "task-3",
    title: "Preparar apresentação",
    description: "Criar slides para reunião com cliente",
    status: "DONE",
    priority: "HIGH",
    deadline: "2026-03-10",
    created_at: "2026-03-01T09:00:00Z",
    user_id: "user-2",
    user_name: "João Santos",
  },
  {
    id: "task-4",
    title: "Atualizar sistema de inventário",
    description: "Implementar novas funcionalidades no sistema",
    status: "PENDING",
    priority: "LOW",
    deadline: "2026-03-25",
    created_at: "2026-03-03T11:00:00Z",
    user_id: "user-2",
    user_name: "João Santos",
  },
]