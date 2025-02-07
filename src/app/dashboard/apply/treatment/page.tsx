'use client';




import Treatment from '@/views/apply/create/Treatment';
import { Suspense } from 'react';

const TreatmentPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Treatment />
    </Suspense>
  );
}

export default TreatmentPage
