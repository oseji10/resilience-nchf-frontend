// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllDoctors from './AllDoctors'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllDoctors/>
      </Grid>
    </Grid>
  )
}

export default Account
