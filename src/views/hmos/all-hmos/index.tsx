// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllHmos from './AllHmos'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllHmos/>
      </Grid>
    </Grid>
  )
}

export default Account
