'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent, ReactElement } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Cookies from 'js-cookie'

const Patients = ({ tabContentList }: { tabContentList: { [key: string]: ReactElement } }) => {
  // States
  const [activeTab, setActiveTab] = useState('patients')

  const handleChange = (event: SyntheticEvent, value: string) => {
    setActiveTab(value)
  }

  // Get role from cookies
  const role = Cookies.get('role')

  return (
    <TabContext value={activeTab}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <TabList onChange={handleChange} variant='scrollable'>
            <Tab label='Patients' icon={<i className='ri-user-3-line' />} iconPosition='start' value='patients' />
            {role !== '4' && (
              <Tab label='Create Patient' icon={<i className='ri-user-3-line' />} iconPosition='start' value='create' />
            )}
          </TabList>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={activeTab} className='p-0'>
            {tabContentList[activeTab]}
          </TabPanel>
        </Grid>
      </Grid>
    </TabContext>
  )
}

export default Patients
