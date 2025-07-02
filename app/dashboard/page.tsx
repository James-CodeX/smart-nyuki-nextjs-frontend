'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useApiaryStore } from '@/store/apiary'
import { useHiveStore } from '@/store/hive'
import { Home, MapPin, Calendar, Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { apiaries, fetchApiaries } = useApiaryStore()
  const { hives, fetchHives } = useHiveStore()

  useEffect(() => {
    if (user?.beekeeper_profile) {
      fetchApiaries().catch(console.error)
      fetchHives().catch(console.error)
    }
  }, [user, fetchApiaries, fetchHives])

  const totalHives = hives.length
  const activeHives = hives.filter(hive => hive.is_active).length
  const totalApiaries = apiaries.length

  return (
    <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your apiary today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Hives</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHives}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Apiaries</p>
                  <p className="text-2xl font-bold text-gray-900">{totalApiaries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 text-yellow-600 flex items-center justify-center">🍯</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Honey (kg)</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Set up your beekeeper profile to begin managing your apiary
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.beekeeper_profile ? (
                <div className="space-y-4">
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Beekeeper profile completed
                  </p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Experience:</strong> {user.beekeeper_profile.experience_level}</p>
                    <p><strong>Location:</strong> {user.beekeeper_profile.address || 'Not specified'}</p>
                    <p><strong>Established:</strong> {user.beekeeper_profile.established_date}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href="/profile/beekeeper/edit" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Create your beekeeper profile to unlock all features of Smart Nyuki.
                  </p>
                  <Link href="/profile/beekeeper/create">
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Beekeeper Profile
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to manage your apiary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user?.beekeeper_profile ? (
                  <>
                    <Link href="/apiaries/create" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Apiary
                      </Button>
                    </Link>
                    {totalApiaries > 0 ? (
                      <Link href="/hives/create" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <Home className="mr-2 h-4 w-4" />
                          Add Hive
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <Home className="mr-2 h-4 w-4" />
                        Add Hive (Create apiary first)
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Inspection
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      * Inspections will be available in Stage 4
                    </p>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Apiary
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Home className="mr-2 h-4 w-4" />
                      Add Hive
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Inspection
                    </Button>
                    <p className="text-xs text-gray-500 mt-4">
                      * Create a beekeeper profile to access these features
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your account details and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Personal Information</h4>
                  <Link href="/profile/user/edit">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Name:</strong> {user?.full_name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone_number || 'Not provided'}</p>
                  <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Account Status</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Status:</strong> <span className="text-green-600">Active</span></p>
                  <p><strong>Plan:</strong> Free Tier</p>
                  <p><strong>Stage:</strong> Smart Devices (Stage 3)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </DashboardLayout>
  )
}
