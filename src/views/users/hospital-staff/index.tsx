// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import HospitalStaff from './HospitalStaff'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < HospitalStaff/>
      </Grid>
    </Grid>
  )
}

export default Account
