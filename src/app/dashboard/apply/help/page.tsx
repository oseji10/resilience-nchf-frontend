// React Imports
import { Suspense, type ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'



import ApplicationCompleted from '@/views/apply/create/ApplicationCompleted'



const Success = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ApplicationCompleted />
      </Suspense>
);
}

export default Success
