'use client';


import Diagnosis from '@/views/encounters/create/Refraction';

import { Suspense } from 'react';

const DiagnosisPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Diagnosis />
    </Suspense>
  );
}

export default DiagnosisPage
