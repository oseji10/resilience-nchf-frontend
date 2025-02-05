'use client';
import { Suspense } from 'react';
import CreateBilling from '@/views/billings/create/CreateBilling';

const CreateBillingsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateBilling />
    </Suspense>
  );
};

export default CreateBillingsPage;
