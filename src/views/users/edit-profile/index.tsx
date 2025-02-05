// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import EditProfile from './EditProfile'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < EditProfile/>
      </Grid>
    </Grid>
  )
}

export default Account
