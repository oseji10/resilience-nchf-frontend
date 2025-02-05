// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllClinic_receptionists from './AllClinic_receptionists'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllClinic_receptionists/>
      </Grid>
    </Grid>
  )
}

export default Account
