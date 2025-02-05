// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'

const PatientsTab = dynamic(() => import('@/views/patients/patients'))
const CreateTab = dynamic(() => import('@/views/patients/create'))
const NotificationsTab = dynamic(() => import('@/views/patients/notifications'))
const ConnectionsTab = dynamic(() => import('@/views/patients/connections'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  patients: <PatientsTab />,
  create: <CreateTab />,
  // notifications: <NotificationsTab />,
  // connections: <ConnectionsTab />
})

const PatientsPage = () => {
  return <Patients tabContentList={tabContentList()} />
}

export default PatientsPage
