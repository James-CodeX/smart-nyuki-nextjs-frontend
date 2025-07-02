'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserProfileForm } from '@/components/profile/user-profile-form'
import { useAuthStore } from '@/store/auth'

export default function EditUserProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🐝 Smart Nyuki
          </h1>
          <p className="text-gray-600">Edit Your Profile</p>
        </div>
        <UserProfileForm 
          onSuccess={() => router.push('/dashboard')}
          onCancel={() => router.push('/dashboard')}
        />
      </div>
    </div>
  )
}
