// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports


import EncountersTable from './AllEncounters'

const Account = () => {
  return (
    <Grid container spacing={6}>
       <Grid item xs={12}>
        <EncountersTable />
      </Grid>
    </Grid>
  )
}

export default Account
