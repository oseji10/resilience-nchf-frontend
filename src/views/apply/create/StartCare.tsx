'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const StartCare = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const firstName = Cookies.get("firstName");
  const lastName = Cookies.get("lastName");

  const [diagnosisList, setDiagnosisList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    diagnosisRight: '',
    diagnosisLeft: '',
  });


  return (
    <Card>
      <CardContent>
        
      <Typography variant="h4" gutterBottom className="flex items-center space-x-2">
  <i className="ri-hourglass-fill text-500 text-3xl"></i>
  <span>Hi {firstName}!</span>
</Typography>

        <Typography variant="h6" gutterBottom>
          Your application has now been approved and you can start receiving care. Please visit your selected hospital for further guidance.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StartCare;
