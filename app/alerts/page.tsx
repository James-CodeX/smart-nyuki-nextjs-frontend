'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AlertsPage } from '@/components/production/AlertsPage'

export default function AlertsPageRoute() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage hive alerts and notifications</p>
        </div>

        <AlertsPage />
      </div>
    </DashboardLayout>
  )
}
