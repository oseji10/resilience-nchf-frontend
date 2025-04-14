'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// MUI Imports
import { Card, CardContent, Typography, Stepper, Step, StepLabel, Box } from '@mui/material';
import Cookies from 'js-cookie';

const steps = [
  { label: 'Applying', description: 'You are currently filling your form and are yet to submit' },
  { label: 'Application Submitted', description: 'You have submitted your application. It is currently pending review.' },
  { label: 'Doctor Review', description: 'Your primary physician at your selected hospital will review your application.' },
  { label: 'Social Welfare Review', description: 'A social welfare staff will review your application to determine if you are indigent.' },
  { label: 'MDT Review', description: 'A group of professionals called a Multi-disciplinary Tumour Board will review your application.' },
  { label: 'CMD Review', description: 'The Chief Medical Director of the hospital will review your application.' },
  { label: 'Approved!', description: 'Your application has now been approved, and you can begin receiving care.' }
];

const ApplicationStatus = () => {
  const firstName = Cookies.get("firstName");

  // Simulate fetching the current application stage (Replace with API call)
  const [currentStep, setCurrentStep] = useState(1); // 0 = first step

  useEffect(() => {
    // Fetch user application status from API
    axios.get('/api/application-status')
      .then((response) => {
        setCurrentStep(response.data.stage); // Ensure API returns step as an index (0-6)
      })
      .catch((error) => console.error('Error fetching application status:', error));
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Hi {firstName}!
        </Typography>

        <Typography variant="h6" gutterBottom>
          See the status of your application below:
        </Typography>

        {/* Vertical Stepper */}
        <Box sx={{ mt: 3, ml: 5 }}>
          <Stepper activeStep={currentStep} orientation="vertical">
            {steps.map(({ label, description }, index) => (
              <Step key={index}>
                <StepLabel>
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
