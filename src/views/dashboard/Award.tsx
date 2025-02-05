// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Cookies from 'js-cookie';

const Award = () => {
  
  const role = Cookies.get('role');
  const name = Cookies.get('name');

  const getRoleName = (role) => {
    switch (role) {
      case "2":
        return "Clinic Receptionist";
      case "3":
        return "Frontdesk Receptionist";
      case "4":
        return "Doctor";
      case "5":
        return "Workshop Receptionist";
        case "6":
        return "Nurse";
        case "7":
        return "Admin";
        case "8":
        return "Super Admin";
      default:
        return "Unknown Role"; 
    }
  };
  
  
  const roleName = getRoleName(role);
  
  // console.log(roleName); // Outputs the role name based on the role value
  
  return (
    <Card>
      <CardContent className='flex flex-col gap-2 relative items-start'>
        <div>
          <Typography 
          variant='h4'
          style={{color:'red'}}
          >{roleName} Dashboard</Typography>
          <Typography variant='h5'>Welcome back {name}! 🎉</Typography>
          <Typography>This dashbaord lets you manage your patients, inventory and patient encounters.</Typography>
        </div>
        <div>
          {/* <Typography variant='h4' color='primary'>
            $42.8k
          </Typography>
          <Typography>78% of target 🚀</Typography> */}
        </div>
        {/* <Button size='small' variant='contained'>
          View Sales
        </Button> */}
        {/* <img
          src='/images/pages/trophy.png'
          alt='trophy image'
          height={102}
          className='absolute inline-end-7 bottom-6'
        /> */}
      </CardContent>
    </Card>
  )
}

export default Award
