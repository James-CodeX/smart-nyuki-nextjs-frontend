'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApiaryStore } from '@/store/apiary'
import { useHiveStore } from '@/store/hive'
import { useAuthStore } from '@/store/auth'
import { useInspectionStore } from '@/store/inspection'
import { useProductionStore } from '@/store/production'
import { EditUserProfileDialog } from '@/components/dialogs/edit-user-profile-dialog'
import { EditBeekeeperProfileDialog } from '@/components/dialogs/edit-beekeeper-profile-dialog'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'
import Link from 'next/link'
import { Plus, Edit, Home, MapPin, Calendar } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { apiaries } = useApiaryStore()
  const { hives } = useHiveStore()
  const { reports } = useInspectionStore()
  const { harvests } = useProductionStore()

  const totalHives = hives.length
  const activeHives = hives.filter(hive => hive.is_active).length
  const totalApiaries = apiaries.length
  const totalInspections = reports.length
  const totalHoneyKg = Array.isArray(harvests) ? harvests.reduce((total, harvest) => {
    const honeyKg = parseFloat(harvest.honey_kg?.toString() || '0')
    return total + (isNaN(honeyKg) ? 0 : honeyKg)
  }, 0) : 0

  return (
    <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground mt-2">
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
                  <p className="text-sm font-medium text-muted-foreground">Total Hives</p>
                  <p className="text-2xl font-bold text-foreground">{totalHives}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Apiaries</p>
                  <p className="text-2xl font-bold text-foreground">{totalApiaries}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Inspections</p>
                  <p className="text-2xl font-bold text-foreground">{totalInspections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 text-yellow-600 flex items-center justify-center">🍯</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Honey (kg)</p>
                  <p className="text-2xl font-bold text-foreground">{totalHoneyKg.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="max-w-lg mx-auto">
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
                    <Link href="/inspections" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Inspection
                      </Button>
                    </Link>
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
                    <p className="text-xs text-muted-foreground mt-4">
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
                  <h4 className="text-sm font-medium text-foreground">Personal Information</h4>
                  <EditUserProfileDialog>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </EditUserProfileDialog>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Name:</strong> {user?.full_name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone_number || 'Not provided'}</p>
                  <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Account Status</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
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
