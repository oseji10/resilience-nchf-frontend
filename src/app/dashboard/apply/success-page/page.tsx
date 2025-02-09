// React Imports
import { Suspense, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'


import SuccessPage from '@/views/apply/create/SuccessPage'



const Success = () => {
  // return <SuccessPage />
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
}

export default Success
