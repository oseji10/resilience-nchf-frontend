'use client';




import Investigation from '@/views/encounters/create/Investigation';
import { Suspense } from 'react';

const InvestigationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Investigation/>
    </Suspense>
  );
}

export default InvestigationPage
