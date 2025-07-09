'use client'

import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { InspectionScheduleForm } from '@/components/inspections/InspectionScheduleForm'
import { InspectionReportForm } from '@/components/inspections/InspectionReportForm'
import { InspectionDetailsDialog } from '@/components/inspections/InspectionDetailsDialog'
import { useInspectionStore } from '@/store/inspection'
import { InspectionSchedule, InspectionReport } from '@/types'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

moment.locale('en-GB')
const localizer = momentLocalizer(moment)

function InspectionsPageContent() {
  const [selectedSchedule, setSelectedSchedule] = useState<InspectionSchedule | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [showInspectionDetails, setShowInspectionDetails] = useState(false)
  const [selectedInspectionReport, setSelectedInspectionReport] = useState<InspectionReport | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const { schedules, reports, fetchSchedules, fetchReports, completeSchedule, fetchReportsByHive, isLoading } = useInspectionStore()

  useEffect(() => {
    fetchSchedules()
    fetchReports()
  }, [fetchSchedules, fetchReports])

  const events = schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.hive.name + (schedule.is_completed ? ' ✓' : ''),
    start: new Date(schedule.scheduled_date),
    end: new Date(schedule.scheduled_date),
    allDay: true,
    resource: schedule,
    style: {
      backgroundColor: schedule.is_completed ? 'rgb(34, 197, 94)' : 'rgb(251, 146, 60)',
      color: 'white',
    },
  }))

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const scheduledDate = moment(start).format('YYYY-MM-DD')
    setSelectedDate(scheduledDate)
    setShowScheduleForm(true)
  }

  const handleSelectEvent = async (event: any) => {
    const schedule = event.resource as InspectionSchedule
    setSelectedSchedule(schedule)
    
    // If the inspection is completed, try to find and show the report
    if (schedule.is_completed) {
      try {
        const hiveReports = await fetchReportsByHive(schedule.hive.id)
        // Find report that matches this schedule's date
        const matchingReport = hiveReports.find(report => 
          report.schedule?.id === schedule.id || 
          moment(report.inspection_date).isSame(moment(schedule.scheduled_date), 'day')
        )
        
        if (matchingReport) {
          setSelectedInspectionReport(matchingReport)
          setShowInspectionDetails(true)
        } else {
          // No report found, allow creating one
          setShowReportForm(true)
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error)
        setShowReportForm(true)
      }
    } else {
      // Not completed, show form to create report
      setShowReportForm(true)
    }
  }

  const handleCompleteSchedule = async (scheduleId: string) => {
    await completeSchedule(scheduleId, true, 'Marked as completed from calendar')
  }

  const upcomingSchedules = schedules.filter(
    schedule => !schedule.is_completed && new Date(schedule.scheduled_date) >= new Date()
  )

  const completedSchedules = schedules.filter(schedule => schedule.is_completed)

  const overdueSchedules = schedules.filter(
    schedule => !schedule.is_completed && new Date(schedule.scheduled_date) < new Date()
  )

  const handlePreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())
  }

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month').toDate())
  }

  const handleTodayClick = () => {
    setCurrentDate(new Date())
  }

  const currentMonthYear = moment(currentDate).format('MMMM YYYY')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hive Inspections</h1>
          <p className="text-muted-foreground">Schedule and track your hive inspections</p>
        </div>
        <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Inspection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Inspection</DialogTitle>
            </DialogHeader>
            <InspectionScheduleForm
              selectedDate={selectedDate || undefined}
              onSuccess={() => {
                setShowScheduleForm(false)
                setSelectedDate(null)
                fetchSchedules()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scheduled</p>
                <p className="text-2xl font-bold text-foreground">{schedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-foreground">{upcomingSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">{overdueSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingSchedules.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedSchedules.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inspection Calendar</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click on a date to schedule an inspection, or click on an existing inspection to view/complete it.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleTodayClick}>
                    {currentMonthYear}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div style={{ height: '600px' }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  selectable
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  views={['month', 'week', 'day']}
                  defaultView="month"
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  eventPropGetter={(event) => ({
                    style: event.style
                  })}
                  toolbar={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedules.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No upcoming inspections scheduled.
                  </p>
                ) : (
                  upcomingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{schedule.hive.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {schedule.hive.apiary.name} • {moment(schedule.scheduled_date).format('MMMM Do, YYYY')}
                        </p>
                        {schedule.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{schedule.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedSchedule(schedule)
                            setShowReportForm(true)
                          }}
                        >
                          Complete Inspection
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteSchedule(schedule.id)}
                        >
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedSchedules.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No completed inspections yet.
                  </p>
                ) : (
                  completedSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex-1">
                        <h3 className="font-medium">{schedule.hive.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {schedule.hive.apiary.name} • {moment(schedule.scheduled_date).format('MMMM Do, YYYY')}
                        </p>
                        {schedule.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{schedule.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const hiveReports = await fetchReportsByHive(schedule.hive.id)
                              const matchingReport = hiveReports.find(report => 
                                report.schedule?.id === schedule.id || 
                                moment(report.inspection_date).isSame(moment(schedule.scheduled_date), 'day')
                              )
                              
                              if (matchingReport) {
                                setSelectedInspectionReport(matchingReport)
                                setShowInspectionDetails(true)
                              }
                            } catch (error) {
                              console.error('Failed to fetch report details:', error)
                            }
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inspection Report Modal */}
      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Complete Inspection Report
              {selectedSchedule && (
                <span className="text-sm font-normal text-muted-foreground block">
                  {selectedSchedule.hive.name} - {moment(selectedSchedule.scheduled_date).format('MMMM Do, YYYY')}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <InspectionReportForm
            scheduleId={selectedSchedule?.id}
            hiveId={selectedSchedule?.hive.id}
            onSuccess={() => {
              setShowReportForm(false)
              setSelectedSchedule(null)
              fetchSchedules()
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Inspection Details Modal */}
      <InspectionDetailsDialog
        report={selectedInspectionReport}
        open={showInspectionDetails}
        onClose={() => {
          setShowInspectionDetails(false)
          setSelectedInspectionReport(null)
        }}
      />
    </div>
  )
}

export default function InspectionsPage() {
  return (
    <DashboardLayout>
      <InspectionsPageContent />
    </DashboardLayout>
  )
}

