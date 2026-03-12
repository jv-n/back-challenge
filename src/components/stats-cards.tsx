"use client"

import { Card, CardContent } from "@/components/ui/card"
import { type Task } from "@/lib/store"
import { ListTodo, Clock, CheckCircle2, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  tasks: Task[]
}

export function StatsCards({ tasks }: StatsCardsProps) {
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter(
      (t) => t.due_date && new Date(t.due_date) < new Date() && t.status !== "completed"
    ).length,
  }

  const cards = [
    {
      title: "Total de Tarefas",
      value: stats.total,
      icon: ListTodo,
      className: "bg-primary/10 text-primary",
    },
    {
      title: "Em Andamento",
      value: stats.inProgress,
      icon: Clock,
      className: "bg-blue-100 text-blue-700",
    },
    {
      title: "Concluídas",
      value: stats.completed,
      icon: CheckCircle2,
      className: "bg-green-100 text-green-700",
    },
    {
      title: "Atrasadas",
      value: stats.overdue,
      icon: AlertTriangle,
      className: "bg-red-100 text-red-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.className}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
