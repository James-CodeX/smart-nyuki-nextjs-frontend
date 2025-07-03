'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, TrendingUp, Calendar, User, Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useProductionStore } from '@/store/production'
import { HarvestForm } from './HarvestForm'
import moment from 'moment'

export function HarvestsPage() {
  const { harvests, isLoading, fetchHarvests, fetchProductionStats } = useProductionStore()
  const [showHarvestForm, setShowHarvestForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      await fetchHarvests()
      const statsData = await fetchProductionStats()
      setStats(statsData)
    }
    loadData()
  }, []) // Remove dependencies to prevent infinite re-renders


  // Convert to array for easier handling - ensure harvests is always an array
  const harvestsArray = Array.isArray(harvests) ? harvests : []
  
  // Filter harvests based on search term
  const actualFilteredHarvests = harvestsArray.filter(harvest =>
    harvest.hive_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harvest.processing_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harvest.quality_notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate stats for cards - ensure values are numbers
  const totalHoney = actualFilteredHarvests.reduce((sum, harvest) => {
    const honeyKg = parseFloat(harvest.honey_kg?.toString() || '0')
    return sum + (isNaN(honeyKg) ? 0 : honeyKg)
  }, 0)
  
  const totalWax = actualFilteredHarvests.reduce((sum, harvest) => {
    const waxKg = parseFloat(harvest.wax_kg?.toString() || '0')
    return sum + (isNaN(waxKg) ? 0 : waxKg)
  }, 0)
  
  const totalPollen = actualFilteredHarvests.reduce((sum, harvest) => {
    const pollenKg = parseFloat(harvest.pollen_kg?.toString() || '0')
    return sum + (isNaN(pollenKg) ? 0 : pollenKg)
  }, 0)
  
  const averageHoney = actualFilteredHarvests.length > 0 ? totalHoney / actualFilteredHarvests.length : 0

  if (showHarvestForm) {
    return (
      <HarvestForm
        onCancel={() => setShowHarvestForm(false)}
        onSuccess={() => {
          setShowHarvestForm(false)
          fetchHarvests()
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Honey</p>
                <p className="text-2xl font-bold text-foreground">{totalHoney.toFixed(1)}kg</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Wax</p>
                <p className="text-2xl font-bold text-foreground">{totalWax.toFixed(1)}kg</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pollen</p>
                <p className="text-2xl font-bold text-foreground">{totalPollen.toFixed(1)}kg</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Honey/Harvest</p>
                <p className="text-2xl font-bold text-foreground">{averageHoney.toFixed(1)}kg</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Harvest Records */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Harvest Records</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your hive harvest data
              </p>
            </div>
            <Button onClick={() => setShowHarvestForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Harvest
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search harvests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {actualFilteredHarvests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-muted-foreground mb-4">No harvest records yet</p>
              <Button
                variant="outline"
                onClick={() => setShowHarvestForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Record Your First Harvest
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {actualFilteredHarvests.map((harvest) => (
                <div key={harvest.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground">{harvest.hive_name}</h3>
                        <Badge variant="outline">{harvest.apiary_name}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-muted-foreground">
                            {moment(harvest.harvest_date).format('MMM DD, YYYY')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-muted-foreground">{harvest.harvested_by_name}</span>
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">Honey:</span> {harvest.honey_kg}kg
                        </div>
                        {harvest.wax_kg && (
                          <div className="text-muted-foreground">
                            <span className="font-medium">Wax:</span> {harvest.wax_kg}kg
                          </div>
                        )}
                      </div>
                      
                      {harvest.processing_method && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Processing:</span> {harvest.processing_method}
                        </div>
                      )}
                      
                      {harvest.quality_notes && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {harvest.quality_notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
