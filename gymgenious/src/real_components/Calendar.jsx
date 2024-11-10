import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function Calendar({ events, onSelectEvent }) {
  const eventStyleGetter = (event) => {
    const percentageFilled = (event.BookedUsers.length / event.capacity) * 100;

    let backgroundColor = '';
    if (percentageFilled < 20) {
      backgroundColor = '#cfe1b9'; 
    } else if (percentageFilled >= 20 && percentageFilled < 50) {
      backgroundColor = '#b5c99a'; 
    } else if (percentageFilled >= 50 && percentageFilled < 70) {
      backgroundColor = '#97a97c';
    } else if (percentageFilled >= 70 && percentageFilled < 100) {
      backgroundColor = '#87986a'; 
    } else if (percentageFilled === 100) {
      backgroundColor = '#718355';
    }
    
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '10px',
      opacity: 1,
      color: 'black',
      display: 'block',
      padding: '5px',
      border: 'none',
      fontWeight: 'bold',
      textAlign: 'center', 
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', 
    };
    return {
      style: style,
    };
  };

  return (
    <div className="Calendar-Container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className="calendar-content"
        views={['month', 'day']}
        onSelectEvent={onSelectEvent}
        eventPropGetter={eventStyleGetter}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'HH:mm', culture),
          eventTimeRangeFormat: (date, culture, localizer) => {
            const startTime = new Date(date.start).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
            const endTime = new Date(date.end).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return `${startTime} - ${endTime}`;
          },
        }}
      />
    </div>
  );
}
