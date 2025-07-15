'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  MapPin, 
  Layers, 
  Settings, 
  Menu, 
  X, 
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Bell,
  Thermometer
} from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { useAuthStore } from '@/store/auth'
import { useApiaryStore } from '@/store/apiary'
import { useEffect } from 'react'
import { AddSmartDeviceModal } from '@/components/smart-device/add-smart-device-modal'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  badge?: string
  disabled?: boolean
  section: 'main' | 'management' | 'account'
}

const navigationSections = {
  main: {
    title: 'Dashboard',
    items: [
      {
        name: 'Overview',
        href: '/dashboard',
        icon: Home,
        section: 'main' as const
      }
    ]
  },
  management: {
    title: 'Management',
    items: [
      {
        name: 'Apiaries',
        href: '/apiaries',
        icon: MapPin,
        section: 'management' as const
      },
      {
        name: 'Hives',
        href: '/hives',
        icon: Layers,
        section: 'management' as const
      },
      {
        name: 'Inspections',
        href: '/inspections',
        icon: Calendar,
        disabled: false,
        section: 'management' as const
      },
      {
        name: 'Harvests',
        href: '/production',
        icon: TrendingUp,
        disabled: false,
        section: 'management' as const
      },
      {
        name: 'Alerts',
        href: '/alerts',
        icon: Bell,
        disabled: false,
        section: 'management' as const
      }
    ]
  },
  account: {
    title: 'Smart',
    items: [
      {
        name: 'Smart Devices',
        href: '/smart-devices',
        icon: Smartphone,
        section: 'account' as const
      },
      {
        name: 'Sensor Data',
        href: '/sensor-data',
        icon: Thermometer,
        section: 'account' as const
      }
    ]
  }
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapse } = useSidebar()
  const { user } = useAuthStore()

  const SectionHeader = ({ title }: { title: string }) => {
    if (isCollapsed) return null
    
    return (
      <div className="px-3 mb-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
    )
  }

  const NavigationItem = ({ item }: { item: NavigationItem }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <div className={cn(
        'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
        'relative overflow-hidden',
        isCollapsed ? 'justify-center px-2' : 'justify-start',
        item.disabled
          ? 'text-muted-foreground cursor-not-allowed'
          : isActive
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
      )}>
        <Icon className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors',
          !isCollapsed && 'mr-3',
          isActive && 'text-white'
        )} />
        
        {!isCollapsed && (
          <>
            <span className="truncate">{item.name}</span>
            {item.badge && (
              <span className={cn(
                'ml-auto text-xs px-2 py-0.5 rounded-full',
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-y-0 left-0 w-1 bg-slate-700 dark:bg-white rounded-r-full" />
        )}
      </div>
    )

    if (item.disabled) {
      return (
        <div 
          title={isCollapsed ? `${item.name} (${item.badge})` : undefined}
          className="relative"
        >
          {content}
        </div>
      )
    }


    return (
      <Link
        href={item.href}
        title={isCollapsed ? item.name : undefined}
        onClick={() => {
          if (window.innerWidth < 1024) {
            onToggle()
          }
        }}
        className="block relative"
      >
        {content}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-background border-r border-border transition-all duration-300 ease-in-out',
        'flex flex-col shadow-xl lg:shadow-none',
        isCollapsed ? 'w-16' : 'w-72',
        'hidden lg:flex',
        isOpen && 'flex'
      )}>
        {/* Header - Mobile close only */}
        <div className={cn(
          'flex items-center justify-end border-b border-border bg-muted',
          'h-12 px-3 lg:hidden'
        )}>
          <div className="flex items-center space-x-1">
            {/* Mobile close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-muted-foreground hover:bg-accent h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto mt-14">
          <div className="space-y-6">
            {/* Main Section */}
            <div>
              <SectionHeader title={navigationSections.main.title} />
              <div className="space-y-1">
                {navigationSections.main.items.map((item) => (
                  <NavigationItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Management Section */}
            <div>
              <SectionHeader title={navigationSections.management.title} />
              <div className="space-y-1">
                {navigationSections.management.items.map((item) => (
                  <NavigationItem key={item.name} item={item} />
                ))}
              </div>
            </div>

            {/* Account Section */}
            <div>
              <SectionHeader title={navigationSections.account.title} />
              <div className="space-y-1">
                {navigationSections.account.items.map((item) => (
                  <NavigationItem key={item.name} item={item} />
                ))}
      
      {/* Smart-Nyuki Device Button */}
      {user?.beekeeper_profile && !isCollapsed && (
        <div className="px-3 py-1">
          <SmartDeviceButton />
        </div>
      )}
              </div>
            </div>
          </div>
        </nav>

        {/* Theme and collapse buttons at bottom */}
        <div className="border-t border-border p-3">
          <div className="space-y-2">
            {/* Theme toggle button */}
            <ThemeToggle isCollapsed={isCollapsed} />
            
            {/* Settings button */}
            <Link href="/settings">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 transition-colors duration-200",
                  isCollapsed ? "px-0" : "justify-start"
                )}
                title={isCollapsed ? 'Settings' : undefined}
              >
                {isCollapsed ? (
                  <Settings className="h-4 w-4" />
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="text-sm">Settings</span>
                  </>
                )}
              </Button>
            </Link>
            
            {/* Collapse button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className={cn(
                "w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 transition-colors duration-200",
                isCollapsed ? "px-0" : "justify-start"
              )}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm">Collapse</span>
                </>
              )}
            </Button>
          </div>
        </div>

      </aside>
    </>
  )
}

// Smart Device button component with honey theme
function SmartDeviceButton() {
  const { apiaries, fetchApiaries } = useApiaryStore()
  
  useEffect(() => {
    fetchApiaries().catch(console.error)
  }, [fetchApiaries])
  
  return (
    <div className="w-full">
      <AddSmartDeviceModal apiaries={apiaries}>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/50 dark:hover:to-orange-800/50 hover:border-amber-400 dark:hover:border-amber-600 font-medium transition-all duration-200 shadow-sm"
        >
          <span className="mr-2 text-lg">🍯</span>
          Add Smart-Nyuki Device
        </Button>
      </AddSmartDeviceModal>
    </div>
  )
}

// Mobile sidebar toggle button
export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="lg:hidden h-8 w-8"
      title="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
