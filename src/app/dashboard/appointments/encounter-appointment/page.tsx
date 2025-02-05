'use client';
import { Suspense } from 'react';

import CreateEncounterAppointment from '@/views/appointments/create/CreateEncounterAppointment';

const CreateAppointmentsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateEncounterAppointment />
    </Suspense>
  );
};

export default CreateAppointmentsPage;
