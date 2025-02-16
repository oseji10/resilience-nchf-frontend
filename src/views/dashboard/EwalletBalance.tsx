// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import LinearProgress from '@mui/material/LinearProgress'
import Cookies from 'js-cookie'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ThemeColor } from '@/@core/types'

// Components Imports
import OptionMenu from '@/@core/components/option-menu'
import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

type DataType = {
  title: string
  imgSrc: string
  amount: string
  progress: number
  subtitle: string
  color?: ThemeColor
}


const EwalletBalance = () => {

  const [balance, setBalance] = useState(''); 
  const [loading, setLoading] = useState(true);
const fetchBalance = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/hospital/ewallet/balance`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      
      // Map the response to a key-value pair with roleId as the key and roleName as the value
      

      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (loading) {
    return <Typography>
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size={20} />
    </Box>
  </Typography>;
  }
  return (
    <Card>
      <CardHeader
        title='Hospital Ewallet Balance'
        // action={<OptionMenu iconClassName='text-textPrimary' options={['Last 28 Days', 'Last Month', 'Last Year']} />}
      ></CardHeader>
      <CardContent className='flex flex-col gap-11 '>
        <div>
          <div className='flex items-center'>
          <Typography variant="h3">₦{Number(balance).toLocaleString()}</Typography>

            {/* <i className='ri-arrow-up-s-line align-bottom text-success'></i> */}
            {/* <Typography component='span' color='success.main'>
              10%
            </Typography> */}
          </div>
          {/* <Typography>₦0.00 spent last month</Typography> */}
        </div>
        
      </CardContent>
    </Card>



  )
}

export default EwalletBalance
