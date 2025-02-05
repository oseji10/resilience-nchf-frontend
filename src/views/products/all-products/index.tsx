// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports


import ProductsTable from './AllProducts'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        < ProductsTable/>
      </Grid>
    </Grid>
  )
}

export default Account
