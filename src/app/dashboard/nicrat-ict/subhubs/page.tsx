// React Imports
import { Suspense, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'
import NICRATSubHubsTable from './AllHospitals'



const HospitalPage = () => {
//   return <NICRATSubHubsTable />
// }

return (
  <Suspense fallback={<div>Loading...</div>}>
    <NICRATSubHubsTable />
  </Suspense>
);
};

export default HospitalPage
