import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import { Box, CircularProgress } from '@mui/material';

const Award = () => {
  const role = Cookies.get('role'); // Role ID from cookie
  const name = Cookies.get('name'); // Name from cookie
  
  // State to store the role names mapped by roleId
  const [roleNames, setRoleNames] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to fetch role names from an API
  const fetchRoleNames = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/roles`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      
      const data = await response.json();
      
      // Map the response to a key-value pair with roleId as the key and roleName as the value
      const roleMap = data.reduce((acc, role) => {
        if (role.roleName) {
          acc[role.roleId] = role.roleName;
        }
        return acc;
      }, {});

      setRoleNames(roleMap);
    } catch (error) {
      console.error('Error fetching role names:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleNames();
  }, []);

  // Get the role name from the state based on the role ID from cookies
  const roleName = roleNames[role] || 'Unknown Role';

  if (loading) {
    return <Typography>
    <Box display="flex" justifyContent="center" alignItems="center">
      <CircularProgress size={20} />
    </Box>
  </Typography>;
     
    
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-2 relative items-start'>
        <div>
          <Typography variant='h4' style={{ color: 'red' }}>
            {roleName} Dashboard
          </Typography>
          <Typography variant='h5'>Welcome back {name}! 🎉</Typography>
          {/* <Typography>
            This dashboard lets you manage your patients, inventory, and patient encounters.
          </Typography> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default Award;
