// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'
import Create from '@/views/appointments/create'
import CreateAppointment from '@/views/appointments/create/CreateAppointment'
import SearchPatient from '@/views/appointments/create/SearchPatient'


const AppointmentsPage = () => {
  // return <CreateAppointment />
return <SearchPatient/>
}

export default AppointmentsPage
