// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import SocialWelfarePendingPatientsTable from '@/views/users/social-welfare/SocialWelfarePendingPatients'
import SESCalculator from '@/views/users/social-welfare/SESCalculator'




const PatientsPage = () => {
  return <SESCalculator />
  // <SocialWelfarePendingPatientsTable />
}

export default PatientsPage
