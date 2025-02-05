// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Nurses from '@/views/nurses/all-nurses/AllNurses'



const NursesPage = () => {
  return <Nurses />
}

export default NursesPage
