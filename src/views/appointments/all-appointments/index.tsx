// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllAppointments from './AllAppointments'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllAppointments/>
      </Grid>
    </Grid>
  )
}

export default Account
