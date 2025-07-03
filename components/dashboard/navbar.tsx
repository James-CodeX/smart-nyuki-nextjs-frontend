'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User, Settings } from 'lucide-react'
import { SidebarToggle } from '@/components/ui/sidebar'
import { EditUserProfileDialog } from '@/components/dialogs/edit-user-profile-dialog'
import { EditBeekeeperProfileDialog } from '@/components/dialogs/edit-beekeeper-profile-dialog'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/components/ui/use-toast'

interface NavbarProps {
  onSidebarToggle: () => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of Smart Nyuki.',
      })
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: 'Logout failed',
        description: 'An error occurred while logging out.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <SidebarToggle onToggle={onSidebarToggle} />
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🐝</span>
            <div className="text-foreground">
              <h1 className="text-xl font-bold leading-tight">Smart Nyuki</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground font-medium">
            Welcome, {user?.first_name}!
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.full_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <EditUserProfileDialog>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
              </EditUserProfileDialog>
              {user?.beekeeper_profile ? (
                <EditBeekeeperProfileDialog profile={user.beekeeper_profile}>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Beekeeper Profile</span>
                  </DropdownMenuItem>
                </EditBeekeeperProfileDialog>
              ) : (
                <CreateBeekeeperProfileDialog>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Create Beekeeper Profile</span>
                  </DropdownMenuItem>
                </CreateBeekeeperProfileDialog>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer" 
                onClick={handleLogout}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoading ? 'Logging out...' : 'Log out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
