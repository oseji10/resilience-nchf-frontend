// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports



import HospitalsTable from './AllHospitals'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < HospitalsTable/>
      </Grid>
    </Grid>
  )
}

export default Account
