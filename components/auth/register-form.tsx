'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuthStore } from '@/store/auth'
import { RegisterRequest } from '@/types'

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/, 'Password must contain letters, numbers, and special characters'),
  password_confirm: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const register = useAuthStore((state) => state.register)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await register(data as RegisterRequest)
      toast({
        title: 'Registration successful',
        description: 'Welcome to Smart Nyuki! Your account has been created.',
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = 'An error occurred during registration'
      
      try {
        const errorData = JSON.parse(error as string)
        if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors[0]
        } else if (errorData.email) {
          errorMessage = errorData.email[0]
        } else if (errorData.password) {
          errorMessage = Array.isArray(errorData.password) 
            ? errorData.password.join(' ') 
            : errorData.password
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        }
      } catch {
        // Use default error message
      }

      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join Smart Nyuki to manage your apiary effectively
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
                {...registerField('first_name')}
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
                {...registerField('last_name')}
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...registerField('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number (Optional)</Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="+1234567890"
              {...registerField('phone_number')}
              disabled={isLoading}
            />
            {errors.phone_number && (
              <p className="text-sm text-red-500">{errors.phone_number.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 chars, with letters, numbers & symbols"
              {...registerField('password')}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Example: MyPass123! (mix of letters, numbers, symbols)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirm">Confirm Password</Label>
            <Input
              id="password_confirm"
              type="password"
              placeholder="Confirm your password"
              {...registerField('password_confirm')}
              disabled={isLoading}
            />
            {errors.password_confirm && (
              <p className="text-sm text-red-500">{errors.password_confirm.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
