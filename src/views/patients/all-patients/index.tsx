// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports



import PatientsTable from './AllPatients'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < PatientsTable/>
      </Grid>
    </Grid>
  )
}

export default Account
