'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BeekeeperProfileForm } from '@/components/profile/beekeeper-profile-form'
import { useAuthStore } from '@/store/auth'

export default function CreateBeekeeperProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else if (user?.beekeeper_profile) {
      // If user already has a beekeeper profile, redirect to edit page
      router.push('/profile/beekeeper/edit')
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return null
  }

  if (user.beekeeper_profile) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐝 Smart Nyuki
          </h1>
          <p className="text-gray-600">Create Your Beekeeper Profile</p>
        </div>
        <BeekeeperProfileForm 
          onSuccess={() => router.push('/dashboard')}
          onCancel={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}
