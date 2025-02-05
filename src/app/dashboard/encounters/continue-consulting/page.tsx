'use client';

import ContinueConsulting from '@/views/encounters/create/ContinueConsulting'
import { Suspense } from 'react';

const EncountersPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContinueConsulting />
    </Suspense>
  );
}

export default EncountersPage
