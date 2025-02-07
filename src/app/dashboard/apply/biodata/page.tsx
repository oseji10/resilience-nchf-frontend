
'use client';

import Biodata from '@/views/apply/create/Biodata';

import { Suspense } from 'react';

const EncountersPage = () => {
  return (
  <Suspense fallback={<div>Loading...</div>}>
      <Biodata />
    </Suspense>
  );
}

export default EncountersPage
