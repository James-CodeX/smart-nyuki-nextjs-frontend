'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  isCollapsed?: boolean
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return 'System mode'
      default:
        return 'Light mode'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 transition-colors duration-200",
        isCollapsed ? "w-8 px-0" : "w-full justify-start"
      )}
      title={getLabel()}
    >
      {getIcon()}
      {!isCollapsed && <span className="ml-2 text-sm">{getLabel()}</span>}
    </Button>
  )
}
