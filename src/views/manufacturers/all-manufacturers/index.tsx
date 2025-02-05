// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports

import AllManufacturers from './AllManufacturers'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < AllManufacturers/>
      </Grid>
    </Grid>
  )
}

export default Account
