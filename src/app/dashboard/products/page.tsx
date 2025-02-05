// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
import Patients from '@/views/patients'

import ProductsTable from '@/views/products/all-products/AllProducts'



const MedicinePage = () => {
  return <ProductsTable />
}

export default MedicinePage
