'use client'

import { useSearchParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { HiveForm } from '@/components/hives/hive-form'

export default function CreateHivePage() {
  const searchParams = useSearchParams()
  const apiaryId = searchParams.get('apiary')

  return (
    <DashboardLayout>
      <HiveForm preselectedApiaryId={apiaryId || undefined} />
    </DashboardLayout>
  )
}
