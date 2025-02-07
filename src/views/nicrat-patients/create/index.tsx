// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreatePatient from './CreatePatient'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreatePatient />
      </Grid>
    </Grid>
  )
}

export default Create
