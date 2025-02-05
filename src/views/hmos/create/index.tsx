// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreateHmo from './CreateHmo'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateHmo />
      </Grid>
    </Grid>
  )
}

export default Create
