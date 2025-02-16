// MUI Imports
"use client";
import Grid from '@mui/material/Grid'

// Components Imports
import Award from '@/views/dashboard/Award'
import Transactions from '@/views/dashboard/Transactions'
import WeeklyOverview from '@/views/dashboard/WeeklyOverview'
import TotalEarning from '@/views/dashboard/AmountUtilized'
import LineChart from '@/views/dashboard/LineChart'
import DistributedColumnChart from '@/views/dashboard/DistributedColumnChart'
import DepositWithdraw from '@/views/dashboard/DepositWithdraw'
import SalesByCountries from '@/views/dashboard/SalesByCountries'
import CardStatVertical from '@/components/card-statistics/Vertical'
import Table from '@/views/dashboard/Table'
import Cookies from 'js-cookie'
import AmountUtilized from '@/views/dashboard/AmountUtilized';
import EwalletBalance from '@/views/dashboard/EwalletBalance';
import { useEffect, useState } from 'react';
// Get role from cookies
const DashboardAnalytics = () => {
  
  // const role = Cookies.get('role')
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);

  // const role = Cookies.get("role");
  const role = parseInt(Cookies.get("role") || "0", 10);

 
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={4}>
        <Award />
      </Grid>
      {/* <Grid item xs={12} md={8} lg={8}>
      {role !== '2' && (
              
        <Transactions />
            )}
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={4}>
        <WeeklyOverview />
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={4}>
        <AmountUtilized />
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <EwalletBalance />
      </Grid> */}

     {/* Conditionally render based on role */}
     {role === 1 && (
        <Grid item xs={12} md={6} lg={4}>
          <AmountUtilized />
        </Grid>
      )}

      {[6, 7].includes(role) && (
        <Grid item xs={12} md={6} lg={4}>
          <EwalletBalance />
        </Grid>
      )}
    
  

      {/* <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <LineChart />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              title='Total Profit'
              stats='$25.6k'
              avatarIcon='ri-pie-chart-2-line'
              avatarColor='secondary'
              subtitle='Weekly Profit'
              trendNumber='42%'
              trend='positive'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardStatVertical
              stats='862'
              trend='negative'
              trendNumber='18%'
              title='New Project'
              subtitle='Yearly Project'
              avatarColor='primary'
              avatarIcon='ri-file-word-2-line'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DistributedColumnChart />
          </Grid>
        </Grid>
      </Grid> */}
      {/* <Grid item xs={12} md={6} lg={4}>
        <SalesByCountries />
      </Grid> */}
      {/* <Grid item xs={12} lg={8}>
        <DepositWithdraw />
      </Grid> */}
      {/* <Grid item xs={12}>
      <h4>Recent Patients</h4>
        <Table />
      </Grid> */}
    </Grid>
  )
}

export default DashboardAnalytics
