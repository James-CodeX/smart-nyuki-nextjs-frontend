import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🐝 Smart Nyuki
          </h1>
          <p className="text-muted-foreground">Apiary Management System</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
