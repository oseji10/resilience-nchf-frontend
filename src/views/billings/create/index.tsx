// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreateAppointment from './CreateAppointment'
import SearchPatient from './SearchPatient'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <CreateAppointment /> */}
        <SearchPatient/>
      </Grid>
    </Grid>
  )
}

export default Create
