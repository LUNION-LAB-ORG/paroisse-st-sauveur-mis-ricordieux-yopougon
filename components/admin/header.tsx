"use client"

import { Bell } from "lucide-react"
import { Avatar, SearchField } from "@heroui/react"

interface HeaderProps {
  title: string
  showSearch?: boolean
}

export function Header({ title, showSearch = false }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 pb-4 border-b border-gray-100">
      <h1 className="text-xl lg:text-2xl font-bold text-[#2d2d83]">{title}</h1>

      <div className="flex items-center gap-3 lg:gap-4">
        {showSearch && (
          <SearchField className="flex-1 sm:flex-initial">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input className="w-full sm:w-48 lg:w-72" placeholder="Rechercher..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        )}

        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#98141f] rounded-full" />
        </button>

        <div className="flex items-center gap-2 lg:gap-3 shrink-0 pl-2 border-l border-gray-200">
          <Avatar className="ring-2 ring-[#2d2d83]/20">
            <Avatar.Image src="/priest-african-man.jpg" alt="Admin" />
            <Avatar.Fallback className="bg-[#2d2d83] text-white text-sm">AD</Avatar.Fallback>
          </Avatar>
          <div className="hidden sm:block">
            <span className="font-medium text-sm text-gray-800 block leading-tight">Administrateur</span>
            <span className="text-xs text-muted">Paroisse</span>
          </div>
        </div>
      </div>
    </header>
  )
}
