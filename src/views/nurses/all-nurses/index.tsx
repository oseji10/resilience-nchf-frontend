// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllNurses from './AllNurses'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllNurses/>
      </Grid>
    </Grid>
  )
}

export default Account
