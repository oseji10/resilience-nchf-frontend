// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Appointment from '@/views/appointments/all-appointments/AllAppointments'



const AppointmentPage = () => {
  return <Appointment />
}

export default AppointmentPage
