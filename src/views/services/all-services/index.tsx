// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports


import ServicesTable from './AllServices'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < ServicesTable/>
      </Grid>
    </Grid>
  )
}

export default Account
