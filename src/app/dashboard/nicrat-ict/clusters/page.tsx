// React Imports
import { Suspense, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'
import NICRATClustersTable from './AllHospitals'



const HospitalPage = () => {
//   return <NICRATClustersTable />
// }

return (
  <Suspense fallback={<div>Loading...</div>}>
    <NICRATClustersTable />
  </Suspense>
);
};

export default HospitalPage
