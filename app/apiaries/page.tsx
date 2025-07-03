'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiaryStore } from '@/store/apiary'
import { useAuthStore } from '@/store/auth'
import { Plus, MapPin, Edit, Trash2, BarChart3 } from 'lucide-react'
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No beekeeper profile</h3>
          <p className="mt-1 text-sm text-gray-500">
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
            <h1 className="text-3xl font-bold text-gray-900">Apiaries</h1>
            <p className="text-gray-600 mt-2">
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

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading apiaries...</div>
        </div>
      ) : apiaries.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No apiaries</h3>
          <p className="mt-1 text-sm text-gray-500">
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
                  <div className="flex space-x-1">
                    <Link href={`/apiaries/${apiary.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(apiary.id)}
                      disabled={deletingId === apiary.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {apiary.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>
                      {apiary.address || `${apiary.latitude}, ${apiary.longitude}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span>{apiary.hives?.length || 0} hives</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link href={`/apiaries/${apiary.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/apiaries/${apiary.id}/hives`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Manage Hives
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics */}
      {apiaries.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Apiaries</p>
                  <p className="text-2xl font-bold text-gray-900">{apiaries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiaries.reduce((total, apiary) => total + (apiary.hives?.length || 0), 0)}
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
                  <p className="text-sm font-medium text-gray-600">Avg. Hives per Apiary</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {apiaries.length > 0 
                      ? Math.round(apiaries.reduce((total, apiary) => total + (apiary.hives?.length || 0), 0) / apiaries.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
