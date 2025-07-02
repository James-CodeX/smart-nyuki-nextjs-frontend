'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ApiaryForm } from '@/components/apiaries/apiary-form'
import { useApiaryStore } from '@/store/apiary'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Apiary } from '@/types'

export default function EditApiaryPage() {
  const params = useParams()
  const { fetchApiary, currentApiary, isLoading } = useApiaryStore()
  const [apiary, setApiary] = useState<Apiary | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchApiary(params.id as string).then(() => {
        // The current apiary will be set in the store
      }).catch(console.error)
    }
  }, [params.id, fetchApiary])

  useEffect(() => {
    if (currentApiary && currentApiary.id === params.id) {
      setApiary(currentApiary)
    }
  }, [currentApiary, params.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading apiary...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!apiary) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Apiary not found</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ApiaryForm apiary={apiary} isEdit={true} />
    </DashboardLayout>
  )
}
