'use client';
import { Suspense } from 'react';

import CreateEncounterBilling from '@/views/billings/create/CreateEncounterBilling';

const CreateBillingsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateEncounterBilling />
    </Suspense>
  );
};

export default CreateBillingsPage;
