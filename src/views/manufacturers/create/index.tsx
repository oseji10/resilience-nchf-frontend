// MUI Imports
import Grid from '@mui/material/Grid'

// Component Imports
import CreateManufacturer from './CreateManufacturer'


const Create = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CreateManufacturer />
      </Grid>
    </Grid>
  )
}

export default Create
