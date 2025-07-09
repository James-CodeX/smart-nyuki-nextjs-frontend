'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { HarvestsPage } from '@/components/production/HarvestsPage'

export default function ProductionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Harvests</h1>
          <p className="text-muted-foreground">Track and manage your hive harvest data</p>
        </div>

        <HarvestsPage />
      </div>
    </DashboardLayout>
  )
}
