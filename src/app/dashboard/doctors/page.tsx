// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Doctors from '@/views/doctors/all-doctors/AllDoctors'



const DoctorsPage = () => {
  return <Doctors />
}

export default DoctorsPage
