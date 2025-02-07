// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllPatients from './AllPatients'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        <AllPatients />
      </Grid>
    </Grid>
  )
}

export default Account
