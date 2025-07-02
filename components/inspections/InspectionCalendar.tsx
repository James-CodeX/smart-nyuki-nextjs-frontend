import React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useInspectionStore } from '@/store/inspection';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

export const InspectionCalendar = () => {
  const { schedules, fetchSchedules, completeSchedule } = useInspectionStore();

  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const events = schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.hive.name,
    start: new Date(schedule.scheduled_date),
    end: new Date(schedule.scheduled_date),
    allDay: true,
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const scheduledDate = moment(start).format('YYYY-MM-DD');
    // Implement scheduling logic here
    console.log('Scheduled Date:', scheduledDate);
  };

  const handleSelectEvent = (event: any) => {
    // Implement event completion logic here
    console.log('Selected Event ID:', event.id);
    completeSchedule(event.id, true, 'Completed via calendar');
  };

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        views={['month', 'week', 'day']}
      />
    </div>
  );
};

