'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useBeekeeperProfileStore } from '@/store/beekeeper-profile'
import { useAuthStore } from '@/store/auth'
import { CreateBeekeeperProfileRequest, BeekeeperProfile } from '@/types'

const beekeeperProfileSchema = z.object({
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  address: z.string().optional(),
  experience_level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    required_error: 'Please select an experience level',
  }),
  established_date: z.string().min(1, 'Established date is required'),
  certification_details: z.string().optional(),
  profile_picture_url: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

type BeekeeperProfileFormData = z.infer<typeof beekeeperProfileSchema>

interface BeekeeperProfileFormProps {
  profile?: BeekeeperProfile;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BeekeeperProfileForm({ profile, onSuccess, onCancel }: BeekeeperProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { createProfile, updateProfile } = useBeekeeperProfileStore()
  const { user, refreshUserProfile } = useAuthStore()

  const isEditing = !!profile

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BeekeeperProfileFormData>({
    resolver: zodResolver(beekeeperProfileSchema),
    defaultValues: profile ? {
      latitude: profile.latitude,
      longitude: profile.longitude,
      address: profile.address || '',
      experience_level: profile.experience_level,
      established_date: profile.established_date,
      certification_details: profile.certification_details || '',
      profile_picture_url: profile.profile_picture_url || '',
      notes: profile.notes || '',
    } : {
      latitude: '',
      longitude: '',
      address: '',
      experience_level: 'Beginner',
      established_date: '',
      certification_details: '',
      profile_picture_url: '',
      notes: '',
    },
  })

  const experienceLevel = watch('experience_level')

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toString())
          setValue('longitude', position.coords.longitude.toString())
          toast({
            title: 'Location updated',
            description: 'Your current location has been set.',
          })
        },
        (error) => {
          toast({
            title: 'Location error',
            description: 'Could not get your current location. Please enter manually.',
            variant: 'destructive',
          })
        }
      )
    } else {
      toast({
        title: 'Location not supported',
        description: 'Geolocation is not supported by this browser.',
        variant: 'destructive',
      })
    }
  }

  const onSubmit = async (data: BeekeeperProfileFormData) => {
    setIsLoading(true)
    try {
      if (isEditing && profile) {
        await updateProfile(profile.id, data as Partial<CreateBeekeeperProfileRequest>)
        toast({
          title: 'Profile updated',
          description: 'Your beekeeper profile has been updated successfully.',
        })
      } else {
        await createProfile(data as CreateBeekeeperProfileRequest)
        toast({
          title: 'Profile created',
          description: 'Your beekeeper profile has been created successfully.',
        })
        
        // Refresh user data to get updated beekeeper_profile
        try {
          await refreshUserProfile()
        } catch (error) {
          console.error('Failed to refresh user profile:', error)
        }
      }
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Profile operation error:', error)
      let errorMessage = `An error occurred while ${isEditing ? 'updating' : 'creating'} your profile`
      
      try {
        const errorData = JSON.parse(error as string)
        if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        }
      } catch {
        // Use default error message
      }

      toast({
        title: `Profile ${isEditing ? 'update' : 'creation'} failed`,
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Beekeeper Profile' : 'Create Beekeeper Profile'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your beekeeper profile information'
            : 'Set up your beekeeper profile to access all Smart Nyuki features'
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {/* Location Fields */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Location</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                Use Current Location
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  placeholder="40.12345678"
                  {...register('latitude')}
                  disabled={isLoading}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  placeholder="-74.12345678"
                  {...register('longitude')}
                  disabled={isLoading}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                placeholder="123 Farm Road, City, State"
                {...register('address')}
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <Label>Experience Level *</Label>
            <Select
              value={experienceLevel}
              onValueChange={(value) => setValue('experience_level', value as any)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience_level && (
              <p className="text-sm text-red-500">{errors.experience_level.message}</p>
            )}
          </div>

          {/* Established Date */}
          <div className="space-y-2">
            <Label htmlFor="established_date">When did you start beekeeping? *</Label>
            <Input
              id="established_date"
              type="date"
              {...register('established_date')}
              disabled={isLoading}
            />
            {errors.established_date && (
              <p className="text-sm text-red-500">{errors.established_date.message}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certification_details">Certification Details (Optional)</Label>
              <Input
                id="certification_details"
                placeholder="e.g., Certified Beekeeper Level 2"
                {...register('certification_details')}
                disabled={isLoading}
              />
              {errors.certification_details && (
                <p className="text-sm text-red-500">{errors.certification_details.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_picture_url">Profile Picture URL (Optional)</Label>
              <Input
                id="profile_picture_url"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                {...register('profile_picture_url')}
                disabled={isLoading}
              />
              {errors.profile_picture_url && (
                <p className="text-sm text-red-500">{errors.profile_picture_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                placeholder="Additional information about your beekeeping operation..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('notes')}
                disabled={isLoading}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Profile' : 'Create Profile')}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
