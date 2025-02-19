// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports



import PatientBillingsTable from './PatientBillings'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < PatientBillingsTable/>
      </Grid>
    </Grid>
  )
}

export default Account
