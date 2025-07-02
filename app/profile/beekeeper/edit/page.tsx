'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BeekeeperProfileForm } from '@/components/profile/beekeeper-profile-form'
import { useAuthStore } from '@/store/auth'
import { useBeekeeperProfileStore } from '@/store/beekeeper-profile'
import { BeekeeperProfile } from '@/types'

export default function EditBeekeeperProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { fetchProfiles, currentProfile, isLoading } = useBeekeeperProfileStore()
  const [profile, setProfile] = useState<BeekeeperProfile | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (!user?.beekeeper_profile) {
      // If user doesn't have a beekeeper profile, redirect to create page
      router.push('/profile/beekeeper/create')
    } else {
      // Fetch the user's beekeeper profiles
      fetchProfiles().catch(console.error)
    }
  }, [isAuthenticated, user, router, fetchProfiles])

  useEffect(() => {
    if (user?.beekeeper_profile) {
      setProfile(user.beekeeper_profile)
    } else if (currentProfile) {
      setProfile(currentProfile)
    }
  }, [user, currentProfile])

  if (!isAuthenticated || !user) {
    return null
  }

  if (!user.beekeeper_profile) {
    return null // Will redirect
  }

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐝 Smart Nyuki
          </h1>
          <p className="text-gray-600">Edit Your Beekeeper Profile</p>
        </div>
        {profile && (
          <BeekeeperProfileForm 
            profile={profile}
            onSuccess={() => router.push('/dashboard')}
            onCancel={() => router.push('/dashboard')}
          />
        )}
      </div>
    </div>
  )
}
