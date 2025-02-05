// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Manufacturer from '@/views/manufacturers/all-manufacturers/AllManufacturers'



const ManufacturerPage = () => {
  return <Manufacturer />
}

export default ManufacturerPage
