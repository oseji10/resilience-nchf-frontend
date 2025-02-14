// React Imports
import { Suspense, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'
import StartCare from '@/views/apply/create/StartCare';



const Success = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <StartCare />
      </Suspense>
);
}

export default Success
