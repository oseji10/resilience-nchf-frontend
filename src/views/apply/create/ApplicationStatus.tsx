'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Stepper, Step, StepLabel, CardContent, Card, Typography, Box, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';

const ApplicationStatus = () => {
  const [steps, setSteps] = useState([]); 
  const [currentStep, setCurrentStep] = useState(null); 
  const [loading, setLoading] = useState(true);

  const phoneNumber = Cookies.get("phoneNumber");
  const firstName = Cookies.get("firstName");

  useEffect(() => {
    if (!phoneNumber) return;

    const token = Cookies.get("authToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch step list first
        const stepsRes = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/status_list`);
        console.log("✅ Steps List:", stepsRes.data);
        const stepList = stepsRes.data;
        setSteps(stepList); 

        // Fetch user status
        const statusRes = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/${phoneNumber}/status`, config);
        console.log("✅ User Status ID:", statusRes.data);

        // Ensure we got a valid number
        const stepId = Number(statusRes.data);
        if (isNaN(stepId)) {
          console.error("❌ Invalid Step ID:", statusRes.data);
          setCurrentStep(0);
          return;
        }

        console.log("🎯 Extracted Step ID:", stepId);

        // Find index *after* steps have been set
        setTimeout(() => {
          setSteps((prevSteps) => {
            const stepIndex = prevSteps.findIndex(step => step.statusId === stepId);
            console.log("🎯 Calculated Step Index:", stepIndex);

            setCurrentStep(stepIndex !== -1 ? stepIndex : 0);
            return prevSteps;
          });
        }, 200);

      } catch (error) {
        console.error("❌ Error fetching data:", error.response ? error.response.data : error.message);
        setCurrentStep(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [phoneNumber]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Hi {firstName || "User"}!
        </Typography>

        <Typography variant="h6" gutterBottom>
          See the status of your application below:
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 3, ml: 5 }}>
            <Stepper activeStep={currentStep} orientation="vertical">
              {steps.map(({ statusId, label, description }, index) => (
                <Step key={statusId} completed={index < currentStep}>
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
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
