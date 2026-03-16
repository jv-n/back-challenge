export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE"
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH"

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
  fileUrl?: string
}