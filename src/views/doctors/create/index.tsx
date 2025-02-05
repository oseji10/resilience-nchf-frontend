// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreateUser from './CreateUser'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateUser />
      </Grid>
    </Grid>
  )
}

export default Create
