'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardContent } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const NICRATAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnalytics(response.data);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        NICRAT Analytics
      </Typography>
      <Grid container spacing={3}>
        {/* Enrolments by Hospitals */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Patient Enrolment by Hospitals</Typography>
              <Bar data={{
                labels: analytics.hospitals.map(h => h.name),
                datasets: [{
                  label: 'Enrolments',
                  data: analytics.hospitals.map(h => h.count),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }],
              }} />
            </CardContent>
          </Card>
        </Grid>


        {/* Enrolments by Cancer Type */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Patient Enrolment by Cancer Type</Typography>
              <Bar data={{
                labels: analytics.cancerTypes.map(c => c.name),
                datasets: [{
                  label: 'Patients',
                  data: analytics.cancerTypes.map(c => c.count),
                  backgroundColor: 'rgba(153, 102, 255, 0.6)',
                }],
              }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Enrolments by State of Origin */}
        <Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Patient Enrolment by State of Origin</Typography>
      <Box sx={{ height: 600, overflowY: "auto" }}> {/* Ensure max height & scrolling */}
        <Bar 
          data={{
            labels: analytics.stateOfOrigin.map(s => s.name),
            datasets: [{
              label: 'Enrolments',
              data: analytics.stateOfOrigin.map(s => s.count),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }],
          }} 
          options={{
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false, // Prevent unwanted stretching
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { beginAtZero: true },
              y: {
                ticks: {
                  font: {
                    size: 10, // Reduce font size for better visibility
                  },
                },
              },
            },
            elements: {
              bar: {
                maxBarThickness: 12, // Ensures all 37 bars fit properly
              },
            },
          }} 
        />
      </Box>
    </CardContent>
  </Card>
</Grid>



        {/* Enrolments by State of Residence */}
        <Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Patient Enrolment by State of Residence</Typography>
      <Box sx={{ height: 600, overflowY: "auto" }}> {/* Ensure max height & scrolling */}
        <Bar 
          data={{
            labels: analytics.stateOfResidence.map(s => s.name),
            datasets: [{
              label: 'Enrolments',
              data: analytics.stateOfResidence.map(s => s.count),
              // backgroundColor: 'rgba(75, 192, 192, 0.6)',
              backgroundColor: ['#4BC0C0', '#FF9F40', '#9966FF'],
            }],
          }} 
          options={{
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false, // Prevent unwanted stretching
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { beginAtZero: true },
              y: {
                ticks: {
                  font: {
                    size: 10, // Reduce font size for better visibility
                  },
                },
              },
            },
            elements: {
              bar: {
                maxBarThickness: 12, // Ensures all 37 bars fit properly
              },
            },
          }} 
        />
      </Box>
    </CardContent>
  </Card>
</Grid>
        
<Grid item xs={12} md={6}>
  <Card>
    <CardContent>
      <Typography variant="h6">Patient Enrolment by Gender</Typography>
      <Box sx={{ height: 400 }}>
        <Pie
          data={{
            labels: analytics.gender.map(g => g.name), // ["Male", "Female"]
            datasets: [
              {
                data: analytics.gender.map(g => g.count), // Count values
                backgroundColor: ["#36A2EB", "#FF6384"], // Colors for Male & Female
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "bottom" },
            },
          }}
        />
      </Box>
    </CardContent>
  </Card>
</Grid>

        {/* Frequently Consumed Products */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Frequently Consumed Products</Typography>
              <Bar data={{
                labels: analytics.products.map(p => p.name),
                datasets: [{
                  label: 'Consumption',
                  data: analytics.products.map(p => p.count),
                  backgroundColor: 'rgba(255, 159, 64, 0.6)',
                }],
              }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NICRATAnalytics;
