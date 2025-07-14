'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApiaryStore } from '@/store/apiary'
import { useAuthStore } from '@/store/auth'
import { Plus, MapPin, Edit, Trash2, BarChart3, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

export default function ApiariesPage() {
  const { user } = useAuthStore()
  const { apiaries, isLoading, fetchApiaries, deleteApiary } = useApiaryStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user?.beekeeper_profile) {
      fetchApiaries().catch(console.error)
    }
  }, [user, fetchApiaries])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this apiary? This action cannot be undone.')) {
      setDeletingId(id)
      try {
        await deleteApiary(id)
      } catch (error) {
        console.error('Failed to delete apiary:', error)
        alert('Failed to delete apiary. Please try again.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (!user?.beekeeper_profile) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No beekeeper profile</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You need to create a beekeeper profile before managing apiaries.
          </p>
          <div className="mt-6">
            <CreateBeekeeperProfileDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Beekeeper Profile
              </Button>
            </CreateBeekeeperProfileDialog>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Apiaries</h1>
            <p className="text-muted-foreground mt-2">
              Manage your beekeeping locations and apiaries.
            </p>
          </div>
          <Link href="/apiaries/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Apiary
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      {apiaries.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Apiaries</p>
                  <p className="text-2xl font-bold text-foreground">{apiaries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Hives</p>
                  <p className="text-2xl font-bold text-foreground">
                    {apiaries.reduce((total, apiary) => total + (apiary.hives_count || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 text-amber-600 flex items-center justify-center text-lg">📍</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg. Hives per Apiary</p>
                  <p className="text-2xl font-bold text-foreground">
                    {apiaries.length > 0 
                      ? Math.round(apiaries.reduce((total, apiary) => total + (apiary.hives_count || 0), 0) / apiaries.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Loading apiaries...</div>
        </div>
      ) : apiaries.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No apiaries</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first apiary.
          </p>
          <div className="mt-6">
            <Link href="/apiaries/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first apiary
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiaries.map((apiary) => (
            <Card key={apiary.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{apiary.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/apiaries/${apiary.id}/edit`} className="flex items-center">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(apiary.id)}
                        disabled={deletingId === apiary.id}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between">
                  <CardDescription className="flex-1">
                    {apiary.description || 'No description provided'}
                  </CardDescription>
                  {apiary.smart_status_display && (
                    <Badge 
                      variant="outline" 
                      className={`ml-2 text-xs ${
                        apiary.smart_status === 'fully_smart' ? 'text-green-600 border-green-200 bg-green-50' :
                        apiary.smart_status === 'partially_smart' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' :
                        apiary.smart_status === 'not_smart' ? 'text-gray-600 border-gray-200 bg-gray-50' :
                        'text-red-600 border-red-200 bg-red-50'
                      }`}
                    >
                      {apiary.smart_status_display}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {apiary.address || `${apiary.latitude}, ${apiary.longitude}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span>{apiary.hives_count || 0} hives</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/apiaries/${apiary.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
