// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import DoctorPendingPatientsTable from '@/views/users/doctor/DoctorPendingPatients'



const PatientsPage = () => {
  return <DoctorPendingPatientsTable />
}

export default PatientsPage
