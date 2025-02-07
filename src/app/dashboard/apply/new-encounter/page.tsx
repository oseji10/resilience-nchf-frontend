// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
// import NewEncounter from '@/views/encounters/create'
import CreateEncounter from '@/views/apply/create/SearchPatient'

const EncountersTab = dynamic(() => import('@/views/apply/encounters'))
const CreateTab = dynamic(() => import('@/views/apply/create'))

// Vars
const tabContentList = (): { [key: string]: ReactElement } => ({
  // encounters: <EncountersTab />,
  create: <CreateTab />,
})

const EncountersPage = () => {
  return <CreateEncounter />
}

export default EncountersPage
