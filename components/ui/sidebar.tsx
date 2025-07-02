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
  User,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut
} from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useSidebar } from './sidebar-context'
import { useAuthStore } from '@/store/auth'

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
        badge: 'Soon',
        disabled: true,
        section: 'management' as const
      },
      {
        name: 'Production',
        href: '/production',
        icon: TrendingUp,
        badge: 'Soon',
        disabled: true,
        section: 'management' as const
      }
    ]
  },
  account: {
    title: 'Account',
    items: [
      {
        name: 'Profile',
        href: '/profile/user/edit',
        icon: User,
        section: 'account' as const
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        badge: 'Soon',
        disabled: true,
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
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
          ? 'text-gray-400 cursor-not-allowed'
          : isActive
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
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
                  : 'bg-gray-200 text-gray-600'
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-y-0 left-0 w-1 bg-white rounded-r-full" />
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
        'fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        'flex flex-col shadow-xl lg:shadow-none',
        isCollapsed ? 'w-16' : 'w-72',
        'hidden lg:flex',
        isOpen && 'flex'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-500',
          isCollapsed ? 'h-16 px-2' : 'h-16 px-6'
        )}>
          <div className="flex items-center space-x-3 text-white">
            <div className="text-2xl">🐝</div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold">Smart Nyuki</h1>
                <p className="text-xs text-amber-100">Apiary Management</p>
              </div>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-1">
            {/* Collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex text-white hover:bg-white/20 h-8 w-8"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            
            {/* Mobile close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto">
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
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile & Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          {/* User info */}
          {!isCollapsed && user && (
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.first_name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Version info */}
          <div className={cn(
            'px-4 py-3 border-t border-gray-200',
            isCollapsed ? 'text-center' : ''
          )}>
            {isCollapsed ? (
              <div className="text-xs text-gray-400 font-mono">v2.0</div>
            ) : (
              <div className="text-xs text-gray-500">
                <p className="font-medium">Smart Nyuki v2.0</p>
                <p>Stage 2: Apiaries & Hives</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
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
