'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useApiaryStore } from '@/store/apiary'
import { useAuthStore } from '@/store/auth'
import { CreateApiaryRequest, UpdateApiaryRequest, Apiary } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { MapPin, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

interface ApiaryFormProps {
  apiary?: Apiary | null
  isEdit?: boolean
}

export function ApiaryForm({ apiary, isEdit = false }: ApiaryFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const { createApiary, updateApiary, isLoading } = useApiaryStore()

  const [formData, setFormData] = useState<CreateApiaryRequest>({
    name: '',
    latitude: '',
    longitude: '',
    address: '',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (isEdit && apiary) {
      setFormData({
        name: apiary.name,
        latitude: apiary.latitude,
        longitude: apiary.longitude,
        address: apiary.address || '',
        description: apiary.description || ''
      })
    }
  }, [isEdit, apiary])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {}

    if (!formData.name.trim()) {
      newErrors.name = ['Name is required']
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = ['Latitude is required']
    } else if (isNaN(Number(formData.latitude)) || Math.abs(Number(formData.latitude)) > 90) {
      newErrors.latitude = ['Please enter a valid latitude (-90 to 90)']
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = ['Longitude is required']
    } else if (isNaN(Number(formData.longitude)) || Math.abs(Number(formData.longitude)) > 180) {
      newErrors.longitude = ['Please enter a valid longitude (-180 to 180)']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (isEdit && apiary) {
        const updateData: UpdateApiaryRequest = {
          name: formData.name !== apiary.name ? formData.name : undefined,
          latitude: formData.latitude !== apiary.latitude ? formData.latitude : undefined,
          longitude: formData.longitude !== apiary.longitude ? formData.longitude : undefined,
          address: formData.address !== (apiary.address || '') ? formData.address : undefined,
          description: formData.description !== (apiary.description || '') ? formData.description : undefined
        }
        
        // Only include fields that have changed
        const filteredData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        ) as UpdateApiaryRequest

        if (Object.keys(filteredData).length > 0) {
          await updateApiary(apiary.id, filteredData)
          toast({
            title: 'Success',
            description: 'Apiary updated successfully'
          })
        }
      } else {
        await createApiary(formData)
        toast({
          title: 'Success',
          description: 'Apiary created successfully'
        })
      }
      
      router.push('/apiaries')
    } catch (error: any) {
      console.error('Form submission error:', error)
      
      // Handle API validation errors
      try {
        const errorData = JSON.parse(error.message)
        if (typeof errorData === 'object' && !errorData.detail) {
          setErrors(errorData)
        } else {
          toast({
            title: 'Error',
            description: errorData.detail || 'Something went wrong. Please try again.',
            variant: 'destructive'
          })
        }
      } catch {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive'
        })
      }
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
          toast({
            title: 'Location Updated',
            description: 'Your current location has been set'
          })
        },
        (error) => {
          toast({
            title: 'Location Error',
            description: 'Could not get your current location',
            variant: 'destructive'
          })
        }
      )
    } else {
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by this browser',
        variant: 'destructive'
      })
    }
  }

  if (!user?.beekeeper_profile) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No beekeeper profile</h3>
        <p className="mt-1 text-sm text-gray-500">
          You need to create a beekeeper profile before creating apiaries.
        </p>
        <div className="mt-6">
          <CreateBeekeeperProfileDialog>
            <Button>
              Create Beekeeper Profile
            </Button>
          </CreateBeekeeperProfileDialog>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/apiaries">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Apiaries
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit' : 'Create'} Apiary</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., North Field Apiary"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">
                  Latitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="40.12345678"
                  className={errors.latitude ? 'border-red-500' : ''}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.latitude[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="longitude">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="-74.12345678"
                  className={errors.longitude ? 'border-red-500' : ''}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500 mt-1">{errors.longitude[0]}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex items-center"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Use Current Location
              </Button>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Farm Road, City, State"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your apiary (optional)"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : isEdit ? 'Update Apiary' : 'Create Apiary'}
              </Button>
              <Link href="/apiaries" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
