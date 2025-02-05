// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'
import Billing from '@/views/billings/all-billings/AllBillings'



const BillingPage = () => {
  return <Billing />
}

export default BillingPage
