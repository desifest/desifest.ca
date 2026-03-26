import React from 'react'

const Calendar = ({ pageContent = {} }) => {
  const calendarUrl = pageContent.calendar_url || "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1OOyvXelALA3nJXmI2XrqH4gIwUoImjaGSh6IciGamjwoU_LzoJKUuxoZm_qEQODrI2hfaFQk1?gv=true"
  return (
    <div className='p-4  mt-10'>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
        <iframe
          src={calendarUrl}
          style={{ border: 0, display: 'block' }}
          width="100%"
          height="1000"
          frameBorder="0"
          title="Google Calendar Appointment Scheduling"
        />
      </div>
    </div>
  )
}

export default Calendar