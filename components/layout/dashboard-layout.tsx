'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/ui/sidebar'
import { Navbar } from '@/components/dashboard/navbar'
import { useAuthStore } from '@/store/auth'
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar-context'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isCollapsed } = useSidebar()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Full-width top bar */}
      <Navbar onSidebarToggle={toggleSidebar} />
      
      <div className="flex pt-12">
        {/* Sidebar positioned to touch top bar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Main content with proper spacing for sidebar and border */}
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        } p-4 overflow-auto min-h-[calc(100vh-48px)] border-l border-border`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while auth is being initialized
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated and not loading
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}
