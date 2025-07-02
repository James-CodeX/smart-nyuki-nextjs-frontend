'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { HiveForm } from '@/components/hives/hive-form'
import { useHiveStore } from '@/store/hive'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Hive } from '@/types'

export default function EditHivePage() {
  const params = useParams()
  const { fetchHive, currentHive, isLoading } = useHiveStore()
  const [hive, setHive] = useState<Hive | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchHive(params.id as string).then(() => {
        // The current hive will be set in the store
      }).catch(console.error)
    }
  }, [params.id, fetchHive])

  useEffect(() => {
    if (currentHive && currentHive.id === params.id) {
      setHive(currentHive)
    }
  }, [currentHive, params.id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading hive...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!hive) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-gray-500">Hive not found</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <HiveForm hive={hive} isEdit={true} />
    </DashboardLayout>
  )
}
