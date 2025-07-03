'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HarvestsPage } from '@/components/production/HarvestsPage'
import { AlertsPage } from '@/components/production/AlertsPage'
import { TrendingUp, Bell } from 'lucide-react'

export default function ProductionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Production & Monitoring</h1>
          <p className="text-muted-foreground">Track harvests and manage hive alerts</p>
        </div>

        <Tabs defaultValue="harvests" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="harvests">
              <TrendingUp className="mr-2 h-4 w-4" />
              Harvests
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <Bell className="mr-2 h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="harvests">
            <HarvestsPage />
          </TabsContent>
          <TabsContent value="alerts">
            <AlertsPage />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
