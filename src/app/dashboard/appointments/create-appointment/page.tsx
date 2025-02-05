'use client';
import { Suspense } from 'react';
import CreateAppointment from '@/views/appointments/create/CreateAppointment';

const CreateAppointmentsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAppointment />
    </Suspense>
  );
};

export default CreateAppointmentsPage;
