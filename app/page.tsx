import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <main className="flex flex-col items-center justify-center py-24 px-4">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-gray-900">
            🐝 Smart Nyuki
          </h1>
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">
            Apiary Management System
          </h2>
          <p className="text-lg text-center mb-8 text-gray-600 max-w-2xl">
            A comprehensive apiary and honey production management system for beekeepers.
            Manage your hives, track inspections, and monitor honey production with ease.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏠 Apiary Management
              </CardTitle>
              <CardDescription>
                Organize and track multiple apiaries and hives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Keep detailed records of your apiaries, hive locations, and colony health.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📋 Inspection Tracking
              </CardTitle>
              <CardDescription>
                Record and schedule hive inspections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Log inspection results, track colony progress, and schedule follow-ups.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🍯 Production Monitoring
              </CardTitle>
              <CardDescription>
                Monitor honey production and harvest data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Track honey yields, manage harvests, and analyze production trends.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Development Stages */}
        <Card className="mt-12 max-w-4xl w-full">
          <CardHeader>
            <CardTitle>Development Roadmap</CardTitle>
            <CardDescription>
              Smart Nyuki is being developed in stages to provide you with the best experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-green-100 rounded-lg">
                <div className="text-green-600 font-semibold mb-2">✅ Stage 1</div>
                <div className="text-sm font-medium">Accounts</div>
                <div className="text-xs text-gray-600">User Management</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-gray-600 font-semibold mb-2">⏳ Stage 2</div>
                <div className="text-sm font-medium">Apiaries</div>
                <div className="text-xs text-gray-600">Structure Setup</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-gray-600 font-semibold mb-2">⏳ Stage 3</div>
                <div className="text-sm font-medium">Devices</div>
                <div className="text-xs text-gray-600">Smart Monitoring</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-gray-600 font-semibold mb-2">⏳ Stage 4</div>
                <div className="text-sm font-medium">Inspections</div>
                <div className="text-xs text-gray-600">Record Keeping</div>
              </div>
              <div className="text-center p-4 bg-gray-100 rounded-lg">
                <div className="text-gray-600 font-semibold mb-2">⏳ Stage 5</div>
                <div className="text-sm font-medium">Production</div>
                <div className="text-xs text-gray-600">Monitoring</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
