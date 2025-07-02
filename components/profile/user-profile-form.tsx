'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/store/auth'
import { UpdateUserProfileRequest } from '@/types'

const userProfileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string().optional(),
})

type UserProfileFormData = z.infer<typeof userProfileSchema>

interface UserProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserProfileForm({ onSuccess, onCancel }: UserProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user, updateProfile } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      phone_number: user?.phone_number || '',
    },
  })

  const onSubmit = async (data: UserProfileFormData) => {
    setIsLoading(true)
    try {
      await updateProfile(data as UpdateUserProfileRequest)
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Profile update error:', error)
      let errorMessage = 'An error occurred while updating your profile'
      
      try {
        const errorData = JSON.parse(error as string)
        if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.email) {
          errorMessage = errorData.email[0]
        }
      } catch {
        // Use default error message
      }

      toast({
        title: 'Profile update failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="John"
                {...register('first_name')}
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Doe"
                {...register('last_name')}
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number (Optional)</Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="+1234567890"
              {...register('phone_number')}
              disabled={isLoading}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from this form
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Updating...' : 'Update Profile'}
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
