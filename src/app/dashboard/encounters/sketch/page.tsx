'use client';


import DualSketchpad from '@/views/encounters/create/SketchPad';

import { Suspense } from 'react';

const SketchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DualSketchpad />
    </Suspense>
  );
}

export default SketchPage
