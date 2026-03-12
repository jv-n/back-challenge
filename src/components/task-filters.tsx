"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type TaskStatus } from "@/lib/store"
import { Search } from "lucide-react"

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: TaskStatus | "all"
  onStatusFilterChange: (value: TaskStatus | "all") => void
}

export function TaskFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as TaskStatus | "all")}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="in_progress">Em andamento</SelectItem>
          <SelectItem value="completed">Concluídas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
