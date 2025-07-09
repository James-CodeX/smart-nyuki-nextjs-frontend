'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useHiveStore } from '@/store/hive'
import { useApiaryStore } from '@/store/apiary'
import { useAuthStore } from '@/store/auth'
import { CreateHiveRequest, UpdateHiveRequest, Hive } from '@/types'
import { useToast } from '@/components/ui/use-toast'
import { Layers, ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import { CreateBeekeeperProfileDialog } from '@/components/dialogs/create-beekeeper-profile-dialog'

interface HiveFormProps {
  hive?: Hive | null
  isEdit?: boolean
  preselectedApiaryId?: string
}

const HIVE_TYPES = [
  'Langstroth',
  'Top Bar',
  'Warre',
  'Flow Hive',
  'Other'
] as const

export function HiveForm({ hive, isEdit = false, preselectedApiaryId }: HiveFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuthStore()
  const { createHive, updateHive, isLoading } = useHiveStore()
  const { apiaries, fetchApiaries } = useApiaryStore()

  const [formData, setFormData] = useState<CreateHiveRequest>({
    apiary: preselectedApiaryId || '',
    name: '',
    hive_type: 'Langstroth',
    installation_date: '',
    is_active: true
  })

  const [errors, setErrors] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (user?.beekeeper_profile) {
      fetchApiaries().catch(console.error)
    }
  }, [user, fetchApiaries])

  useEffect(() => {
    if (isEdit && hive) {
      setFormData({
        apiary: typeof hive.apiary === 'string' ? hive.apiary : hive.apiary.id,
        name: hive.name,
        hive_type: hive.hive_type,
        installation_date: hive.installation_date,
        is_active: hive.is_active
      })
    }
  }, [isEdit, hive])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }))
    }
  }

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user makes selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {}

    if (!formData.apiary) {
      newErrors.apiary = ['Please select an apiary']
    }

    if (!formData.name.trim()) {
      newErrors.name = ['Name is required']
    }

    if (!formData.hive_type) {
      newErrors.hive_type = ['Please select a hive type']
    }

    if (!formData.installation_date) {
      newErrors.installation_date = ['Installation date is required']
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      if (isEdit && hive) {
        const updateData: UpdateHiveRequest = {
          name: formData.name !== hive.name ? formData.name : undefined,
          hive_type: formData.hive_type !== hive.hive_type ? formData.hive_type : undefined,
          installation_date: formData.installation_date !== hive.installation_date ? formData.installation_date : undefined,
          is_active: formData.is_active !== hive.is_active ? formData.is_active : undefined
        }
        
        // Only include fields that have changed
        const filteredData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        ) as UpdateHiveRequest

        if (Object.keys(filteredData).length > 0) {
          await updateHive(hive.id, filteredData)
          toast({
            title: 'Success',
            description: 'Hive updated successfully'
          })
        }
      } else {
        await createHive(formData)
        toast({
          title: 'Success',
          description: 'Hive created successfully'
        })
      }
      
      router.push('/hives')
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

  if (!user?.beekeeper_profile) {
    return (
      <div className="text-center py-12">
        <Layers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No beekeeper profile</h3>
        <p className="mt-1 text-sm text-gray-500">
          You need to create a beekeeper profile before creating hives.
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

  if (apiaries.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No apiaries found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You need to create an apiary before adding hives.
        </p>
        <div className="mt-6">
          <Link href="/apiaries/create">
            <Button>
              Create Apiary
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/hives">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hives
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit' : 'Create'} Hive</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="apiary">
                Apiary <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.apiary}
                onValueChange={(value) => handleSelectChange(value, 'apiary')}
                disabled={isEdit} // Don't allow changing apiary when editing
              >
                <SelectTrigger className={errors.apiary ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select an apiary" />
                </SelectTrigger>
                <SelectContent>
                  {apiaries.map((apiary) => (
                    <SelectItem key={apiary.id} value={apiary.id}>
                      {apiary.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.apiary && (
                <p className="text-sm text-red-500 mt-1">{errors.apiary[0]}</p>
              )}
            </div>

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
                placeholder="e.g., Hive 001"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hive_type">
                Hive Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.hive_type}
                onValueChange={(value) => handleSelectChange(value, 'hive_type')}
              >
                <SelectTrigger className={errors.hive_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select hive type" />
                </SelectTrigger>
                <SelectContent>
                  {HIVE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.hive_type && (
                <p className="text-sm text-red-500 mt-1">{errors.hive_type[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="installation_date">
                Installation Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="installation_date"
                name="installation_date"
                type="date"
                value={formData.installation_date}
                onChange={handleChange}
                className={errors.installation_date ? 'border-red-500' : ''}
              />
              {errors.installation_date && (
                <p className="text-sm text-red-500 mt-1">{errors.installation_date[0]}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="is_active">
                Active
              </Label>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : isEdit ? 'Update Hive' : 'Create Hive'}
              </Button>
              <Link href="/hives" className="flex-1">
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
