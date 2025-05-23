"use client"

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import axios from 'axios'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/material'
import Swal from 'sweetalert2'

import Cookies from 'js-cookie'

const Biodata = () => {

  const router = useRouter()


  const firstName = Cookies.get("firstName");
  const lastName = Cookies.get("lastName");
  const otherNames = Cookies.get("otherNames");
  const phoneNumber = Cookies.get("phoneNumber");

  const [formData, setFormData] = useState({
    patientId: '',
    nin: '',
    hospitalFileNumber: '',
    hospital: '',
    stateOfOrigin: '',
    stateOfResidence: '',
    bloodGroup: '',
    gender: '',
    occupation: '',
    dateOfBirth: '',
    address: '',
    nextOfKinName: '',
    nextOfKinAddress: '',
    nextOfKinPhoneNumber: '',
    nextOfKinEmail: '',
    nextOfKinRelationship: '',
    nextOfKinOccupation: '',
    nextOfKinGender: '',
    hmo: '',
    hmoNumber: '',
    cancer: '',
    religion: '',

    averageMonthlyIncome: '',
    averageFeedingDaily: '',
    whoProvidesFeeding: '',
    accomodation: '',
    typeOfAccomodation: '',
    noOfGoodSetOfClothes: '',
    howAreClothesGotten: '',
    whyDidYouChooseHospital: '',
    hospitalReceivingCare2: '',
    levelOfSpousalSpupport: '',
    otherSupport: '',

    familySetupSize: '',
    birthOrder: '',
    fathersEducationalLevel: '',
    mothersEducationalLevel: '',
    fathersOccupation: '',
    mothersOccupation: '',
    levelOfFamilyCare: '',
    familyMonthlyIncome: '',

    runningWater: "",
    toiletType: "",
    powerSupply: "",
    meansOfTransport: "",
    mobilePhone: "",
    howPhoneIsRecharged: "",
  })

  const [loading, setLoading] = useState(false)

  const [hospitals, setHospitals] = useState([])
  const [cancers, setCancers] = useState([])
  const [states, setStates] = useState([])
  const [hmos, setHmos] = useState([])

  const [step, setStep] = useState(1)

  const hospitalName = hospitals.find(h => h.hospitalId === formData.hospital)?.hospitalName || "Not Found";
  const patientHMOName = hmos.find(h => h.hmoId === formData.hmo)?.hmoName || "Not Found";
  const stateOfOriginName = states.find(h => h.stateId === formData.stateOfOrigin)?.stateName || "Not Found";
  const stateOfResidenceName = states.find(h => h.stateId === formData.stateOfResidence)?.stateName || "Not Found";



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("authToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const responses = await Promise.allSettled([
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hospitals`, config),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/cancers`, config),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/states`, config),
          axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/hmos`, config),
        ]);

        if (responses[0].status === "fulfilled") setHospitals(responses[0].value.data);
        if (responses[1].status === "fulfilled") setCancers(responses[1].value.data);
        if (responses[2].status === "fulfilled") setStates(responses[2].value.data);
        if (responses[3].status === "fulfilled") setHmos(responses[3].value.data);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchData();
  }, []); // <-- Added dependency array




  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }



  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 5) {
      handleNextStep();
    } else {
      nextStep();
    }
  };

  const eductaionalQualification = [
    "None",
    "Primary School Certificate",
    "Secondary School Certificate",
    "National Certificate in Education",
    "Ordinary National Diploma",
    "Higher National Diploma",
    "Degree",
    "Post Graduate Diploma",
    "Masters Degree",
    "PhD",
    "Others"
  ]

  const nextOfKinRelationshipList = [
    "Father", "Mother", "Son", "Daughter", "Brother", "Sister", "Husband", "Wife",
    "Grandfather", "Grandmother", "Grandson", "Granddaughter", "Uncle", "Aunt",
    "Nephew", "Niece", "Cousin", "Father-in-law", "Mother-in-law", "Son-in-law",
    "Daughter-in-law", "Brother-in-law", "Sister-in-law", "Legal Guardian", "Ward",
    "Adoptive Father", "Adoptive Mother", "Adoptive Son", "Adoptive Daughter",
    "Foster Father", "Foster Mother", "Foster Son", "Foster Daughter", "Fiancé",
    "Fiancée", "Partner", "Close Friend", "Godparent", "Mentor", "Others"
  ];

  const religions = [
    "Christianity", "Catholicism", "Protestantism", "Anglican", "Baptist",
    "Methodist", "Pentecostal", "Evangelical", "Orthodox Christianity",
    "Islam", "Sunni Islam", "Shia Islam", "Sufi Islam",
    "Traditional African Religions", "Yoruba Religion", "Igbo Traditional Religion",
    "Hausa/Fulani Traditional Beliefs", "Edo Traditional Religion",
    "Efik/Ibibio/Annang Traditional Beliefs", "Baha'i Faith", "Hinduism",
    "Buddhism", "Judaism", "Rastafarianism", "Atheism", "Secularism", "Humanism", "Others"
  ];

  const occupations = [
    "Artisan", "Accountant", "Architect", "Alfa", "Banker", "Business Consultant", "Carpenter",
    "Chef", "Civil Engineer", "Civil Servant", "Clergy", "Construction Worker",
    "Content Creator", "Data Analyst", "Dentist", "Doctor", "Driver", "Economist",
    "Electrician", "Entrepreneur", "Event Planner", "Farmer", "Fashion Designer",
    "Filmmaker", "Firefighter", "Fisherman", "Graphic Designer", "Hotel Manager",
    "Human Resource Manager", "Imam", "Journalist", "Lawyer", "Lecturer", "Logistics Manager",
    "Makeup Artist", "Mechanical Engineer", "Medical Laboratory Scientist", "Military",
    "Musician", "Nurse", "Pastor", "Para-military", "Pharmacist", "Photographer",
    "Pilot", "Plumber", "Police", "Professor", "Public Relations Officer",
    "Research Scientist", "Retiree", "Scientist", "Social Media Manager", "Software Developer", "Surveyor",
    "Teacher", "Trader", "Traditional Healer", "Transporter", "University Administrator",
    "Veterinary Doctor", "Welder", "Unemployed", "Others"
  ];

  const nextStep = () => setStep(step + 1)

  // const prevStep = () => setStep(step - 1)
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const handleNextStep = async () => {
    if (step === 1 && !formData.nin) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'NIN is required before proceeding.',
      });
      
      return;
    }

    if (step === 5) {
      setLoading(true);
      const token = Cookies.get("authToken");

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL}/patients/biodata`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Extract success message from the API response, with a fallback
        const successMessage = response.data.message || "Application submitted successfully!";

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: successMessage,
          timer: 3000,
          showConfirmButton: false,
        });

        router.push(`/dashboard/apply/success-page?chfId=${response.data.chfId}`);

      } catch (error) {
        let errorMessage = "Something went wrong. Please try again.";

        // Extract error message from API response
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          timer: 3000,
          showConfirmButton: true, // Allow user to acknowledge the error
        });

      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };




  useEffect(() => {
    const fetchApplicationStatus = async () => {
      setLoading(true); // Show spinner
      const token = Cookies.get("authToken");

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/patient/${phoneNumber}/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data >= 2 && response.data < 7) {
          router.replace(`/dashboard/apply/application-completed`);
        } else if (response.data === 7) {
          router.replace(`/dashboard/apply/start-care`);
        }
        else {
          setLoading(false); // Hide spinner if no redirect

        }
      } catch (error) {
        console.error("Failed to fetch application status:", error);
        setLoading(false); // Hide spinner if there's an error
      }
    };

    fetchApplicationStatus();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </div>
    );
  }





  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          National Cancer Health Fund Application
        </Typography>
        {/* <Typography variant="h6" gutterBottom>
          Patient Details: {patientName}
        </Typography> */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {step === 1 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    <u>Biodata Information</u>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}><TextField type='number' fullWidth label="NIN" value={formData.nin} onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                /></Grid>
                <Grid item xs={12} sm={6}><TextField type='number' fullWidth label="Phone Number" value={phoneNumber} InputLabelProps={{ shrink: !!phoneNumber }} disabled /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="First Name" value={firstName} InputLabelProps={{ shrink: !!firstName }} disabled /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Last Name" value={lastName} InputLabelProps={{ shrink: !!lastName }} disabled /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Other Names" value={otherNames} InputLabelProps={{ shrink: !!otherNames }} disabled /></Grid>
                <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Gender</InputLabel><Select required value={formData.gender} onChange={(e) => handleFormChange('gender', e.target.value)}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select></FormControl></Grid>


                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Blood Group</InputLabel>
                    <Select
                      value={formData.bloodGroup}
                      onChange={(e) => handleFormChange('bloodGroup', e.target.value)}
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Religion</InputLabel>
                    <Select
                      required
                      value={formData.religion}
                      onChange={(e) => handleFormChange("religion", e.target.value)}
                    >
                      {religions.map((religion) => (
                        <MenuItem key={religion} value={religion}>
                          {religion}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      required
                      value={formData.occupation}
                      onChange={(e) => handleFormChange("occupation", e.target.value)}
                    >
                      {occupations.map((occupation) => (
                        <MenuItem key={occupation} value={occupation}>
                          {occupation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}><TextField type='date' fullWidth label="Date of Birth" value={formData.dateOfBirth} onChange={(e) => handleFormChange('dateOfBirth', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={12}><TextField multiline rows={2} maxRows={4} fullWidth label="Address" value={formData.address} onChange={(e) => handleFormChange('address', e.target.value)} /></Grid>
                <Grid item xs={12} sm={6}><TextField select required label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={(e) => handleFormChange('stateOfOrigin', e.target.value)} fullWidth> {states.map((state) => (<MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={6}><TextField select required label="State of Residence" name="stateOfResidence" value={formData.stateOfResidence} onChange={(e) => handleFormChange('stateOfResidence', e.target.value)} fullWidth> {states.map((state) => (<MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={4}><TextField select required label="Hospital of Choice" name="hospital" value={formData.hospital} onChange={(e) => handleFormChange('hospital', e.target.value)} fullWidth> {hospitals.map((hospital) => (<MenuItem key={hospital.hospitalId} value={hospital.hospitalId}>{hospital.hospitalName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Hospital of Choice File Number" value={formData.hospitalFileNumber} onChange={(e) => handleFormChange('hospitalFileNumber', e.target.value)} /></Grid>
                <Grid item xs={12} sm={4}><TextField select label="Cancer Site" name="cancer" value={formData.cancer} onChange={(e) => handleFormChange('cancer', e.target.value)} fullWidth> {cancers.map((cancer) => (<MenuItem key={cancer.cancerId} value={cancer.cancerId}>{cancer.cancerName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={6}><TextField select label="HMO (Optional)" name="hmo" value={formData.hmo} onChange={(e) => handleFormChange('hmo', e.target.value)} fullWidth> {hmos.map((hmo) => (<MenuItem key={hmo.hmoId} value={hmo.hmoId}>{hmo.hmoName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={6}><TextField fullWidth label="HMO Number (Optional)" value={formData.hmoNumber} onChange={(e) => handleFormChange('hmoNumber', e.target.value)} /></Grid>



              </>
            )}
            {step === 2 && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    <u>Next of Kin Details</u>
                  </Typography>
                </Grid>
                {/* <Grid item xs={12} sm={6}><TextField select label="State of Origin" name="stateOfOrigin" value={formData.stateOfOrigin} onChange={(e) => handleFormChange('stateOfOrigin', e.target.value)} fullWidth> {states.map((state) => (<MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>))}</TextField></Grid>
                <Grid item xs={12} sm={6}><TextField select label="State of Residence" name="stateOfResidence" value={formData.stateOfResidence} onChange={(e) => handleFormChange('stateOfResidence', e.target.value)} fullWidth> {states.map((state) => (<MenuItem key={state.stateId} value={state.stateId}>{state.stateName}</MenuItem>))}</TextField></Grid> */}
                <Grid item xs={12} sm={4}><TextField fullWidth label="Next of Kin Name" value={formData.nextOfKinName} onChange={(e) => handleFormChange('nextOfKinName', e.target.value)} /></Grid>
                <Grid item xs={12} sm={4}><TextField type='number' fullWidth label="Next of Kin Phone" value={formData.nextOfKinPhoneNumber} onChange={(e) => handleFormChange('nextOfKinPhoneNumber', e.target.value)} /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Next of Kin Email" value={formData.nextOfKinEmail} onChange={(e) => handleFormChange('nextOfKinEmail', e.target.value)} /></Grid>
                <Grid item xs={12} sm={4}><FormControl fullWidth><InputLabel>Gender</InputLabel><Select value={formData.nextOfKinGender} onChange={(e) => handleFormChange('nextOfKinGender', e.target.value)}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem></Select></FormControl></Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Relationship</InputLabel>
                    <Select
                      value={formData.nextOfKinRelationship}
                      onChange={(e) => handleFormChange("nextOfKinRelationship", e.target.value)}
                    >
                      {nextOfKinRelationshipList.map((relationship) => (
                        <MenuItem key={relationship} value={relationship}>
                          {relationship}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>



                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Occupation</InputLabel>
                    <Select
                      required
                      value={formData.nextOfKinOccupation}
                      onChange={(e) => handleFormChange('nextOfKinOccupation', e.target.value)}
                    >
                      {occupations.map((occupation) => (
                        <MenuItem key={occupation} value={occupation}>
                          {occupation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>


                <Grid item xs={12} sm={12}><TextField multiline rows={2} maxRows={4} fullWidth label="Next of Kin Address" value={formData.nextOfKinAddress} onChange={(e) => handleFormChange('nextOfKinAddress', e.target.value)} /></Grid>
              </>
            )}
            {step === 3 && (
              <>
                {/* <Box > */}
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    <u>Personal History</u>
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Average Monthly Income"
                    value={formData.averageMonthlyIncome}
                    onChange={(e) => handleFormChange("averageMonthlyIncome", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Average Daily Feeding Cost"
                    value={formData.averageFeedingDaily}
                    onChange={(e) => handleFormChange("averageFeedingDaily", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Who Provides Feeding</InputLabel>
                    <Select
                      value={formData.whoProvidesFeeding}
                      onChange={(e) => handleFormChange("whoProvidesFeeding", e.target.value)}
                    >
                      <MenuItem value="Self">Self</MenuItem>
                      <MenuItem value="Spouse">Spouse</MenuItem>
                      <MenuItem value="Parent">Parent</MenuItem>
                      <MenuItem value="Sibling">Sibling</MenuItem>
                      <MenuItem value="Other Relative">Other Relative</MenuItem>
                      <MenuItem value="Charity/NGO">Charity/NGO</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Accommodation Status</InputLabel>
                    <Select
                      value={formData.accomodation}
                      onChange={(e) => handleFormChange("accomodation", e.target.value)}
                    >
                      <MenuItem value="Owned">Owned</MenuItem>
                      <MenuItem value="Rented">Rented</MenuItem>
                      <MenuItem value="Family House">Family House</MenuItem>
                      <MenuItem value="Homeless">Homeless</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type of Accommodation</InputLabel>
                    <Select
                      value={formData.typeOfAccomodation}
                      onChange={(e) => handleFormChange("typeOfAccomodation", e.target.value)}
                    >
                      <MenuItem value="Flat">Flat</MenuItem>
                      <MenuItem value="Self-contained">Self-contained</MenuItem>
                      <MenuItem value="Room & Parlor">Room & Parlor</MenuItem>
                      <MenuItem value="Single Room">Single Room</MenuItem>
                      <MenuItem value="Uncompleted Building">Uncompleted Building</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Good Sets of Clothes"
                    value={formData.noOfGoodSetOfClothes}
                    onChange={(e) => handleFormChange("noOfGoodSetOfClothes", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    maxRows={4}
                    label="How Are Clothes Gotten?"
                    value={formData.howAreClothesGotten}
                    onChange={(e) => handleFormChange("howAreClothesGotten", e.target.value)}
                  />
                </Grid>



                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    maxRows={3}
                    label="Hospital Currently Receiving Care"
                    value={formData.hospitalReceivingCare2}
                    onChange={(e) => handleFormChange("hospitalReceivingCare2", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    maxRows={4}
                    label="Why Did You Choose This Hospital?"
                    value={formData.whyDidYouChooseHospital}
                    onChange={(e) => handleFormChange("whyDidYouChooseHospital", e.target.value)}
                  />
                </Grid>
                {/* 
<Grid item xs={12} sm={6}>
  <TextField select label="Hospital Currently Receiving Care" name="hospitalReceivingCare" value={formData.hospitalReceivingCare} onChange={(e) => handleFormChange('hospitalReceivingCare', e.target.value)} fullWidth> 
    {hospitals.map((hospital) => (
      <MenuItem key={hospital.hospitalId} value={hospital.hospitalId}>
        {hospital.hospitalName}
      </MenuItem>
    ))}
  </TextField>
</Grid> */}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Level of Spousal Support</InputLabel>
                    <Select
                      value={formData.levelOfSpousalSpupport}
                      onChange={(e) => handleFormChange("levelOfSpousalSpupport", e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Minimal">Minimal</MenuItem>
                      <MenuItem value="Moderate">Moderate</MenuItem>
                      <MenuItem value="Full Support">Full Support</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    maxRows={4}
                    label="Other Support"
                    value={formData.otherSupport}
                    onChange={(e) => handleFormChange("otherSupport", e.target.value)}
                  />
                </Grid>

                {/* </Box> */}
              </>
            )}


            {step === 4 && (
              <>

                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    <u>Family History</u>
                  </Typography>
                </Grid>

                {/* New Fields for Family & Financial Information */}
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Family Setup Size" type='number'
                    value={formData.familySetupSize} onChange={(e) => handleFormChange('familySetupSize', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Birth Order" type='number'
                    value={formData.birthOrder} onChange={(e) => handleFormChange('birthOrder', e.target.value)}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={4}>
  <TextField fullWidth label="Father's Educational Level"
    value={formData.fathersEducationalLevel} onChange={(e) => handleFormChange('fathersEducationalLevel', e.target.value)}
  />
</Grid> */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Father's Educational Level</InputLabel>
                    <Select
                      value={formData.fathersEducationalLevel}
                      onChange={(e) => handleFormChange("fathersEducationalLevel", e.target.value)}
                    >
                      {eductaionalQualification.map((qualification) => (
                        <MenuItem key={qualification} value={qualification}>
                          {qualification}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={4}>
  <TextField fullWidth label="Mother's Educational Level"
    value={formData.mothersEducationalLevel} onChange={(e) => handleFormChange('mothersEducationalLevel', e.target.value)}
  />
</Grid> */}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mother's Educational Level</InputLabel>
                    <Select
                      value={formData.mothersEducationalLevel}
                      onChange={(e) => handleFormChange("mothersEducationalLevel", e.target.value)}
                    >
                      {eductaionalQualification.map((qualification) => (
                        <MenuItem key={qualification} value={qualification}>
                          {qualification}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={4}>
  <TextField fullWidth label="Father's Occupation"
    value={formData.fathersOccupation} onChange={(e) => handleFormChange('fathersOccupation', e.target.value)}
  />
</Grid> */}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Father's Occupation</InputLabel>
                    <Select
                      // required
                      value={formData.fathersOccupation}
                      onChange={(e) => handleFormChange('fathersOccupation', e.target.value)}
                    >
                      {occupations.map((occupation) => (
                        <MenuItem key={occupation} value={occupation}>
                          {occupation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={4}>
  <TextField fullWidth label="Mother's Occupation"
    value={formData.mothersOccupation} onChange={(e) => handleFormChange('mothersOccupation', e.target.value)}
  />
</Grid> */}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Mother's Occupation</InputLabel>
                    <Select
                      // required
                      value={formData.mothersOccupation}
                      onChange={(e) => handleFormChange('mothersOccupation', e.target.value)}
                    >
                      {occupations.map((occupation) => (
                        <MenuItem key={occupation} value={occupation}>
                          {occupation}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* <Grid item xs={12} sm={6}>
  <TextField fullWidth label="Level of Family Care"
    value={formData.levelOfFamilyCare} onChange={(e) => handleFormChange('levelOfFamilyCare', e.target.value)}
  />
</Grid> */}

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Level of Family Care</InputLabel>
                    <Select
                      value={formData.levelOfFamilyCare}
                      onChange={(e) => handleFormChange("levelOfFamilyCare", e.target.value)}
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Minimal">Minimal</MenuItem>
                      <MenuItem value="Moderate">Moderate</MenuItem>
                      <MenuItem value="Full Support">Full Support</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Family Monthly Income" type='number'
                    value={formData.familyMonthlyIncome} onChange={(e) => handleFormChange('familyMonthlyIncome', e.target.value)}
                  />
                </Grid>


              </>
            )}

            {/* {step === 5 && (
              <>

                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom>
                    <u>Social Condition</u>
                  </Typography>
                </Grid>
                <Grid container spacing={2}>
                  Running Water
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Running Water Available?"
                      value={formData.runningWater}
                      onChange={(e) => handleFormChange("runningWater", e.target.value)}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Grid>

                  Toilet Type
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Toilet Type"
                      value={formData.toiletType}
                      onChange={(e) => handleFormChange("toiletType", e.target.value)}
                    >
                      <MenuItem value="flush">Flush Toilet</MenuItem>
                      <MenuItem value="pit">Pit Latrine</MenuItem>
                      <MenuItem value="open">Open Defecation</MenuItem>
                      <MenuItem value="others">Others</MenuItem>
                    </TextField>
                  </Grid>

                  Power Supply
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Power Supply"
                      value={formData.powerSupply}
                      onChange={(e) => handleFormChange("powerSupply", e.target.value)}
                    >
                      <MenuItem value="constant">Constant</MenuItem>
                      <MenuItem value="intermittent">Intermittent</MenuItem>
                      <MenuItem value="none">No Power</MenuItem>
                    </TextField>
                  </Grid>

                  Means of Transport
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Means of Transport"
                      value={formData.meansOfTransport}
                      onChange={(e) => handleFormChange("meansOfTransport", e.target.value)}
                    >
                      <MenuItem value="public">Public Transport</MenuItem>
                      <MenuItem value="private">Private Transport</MenuItem>
                      <MenuItem value="walking">Walking</MenuItem>
                    </TextField>
                  </Grid>

                  Mobile Phone Availability
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Do you have a mobile phone?"
                      value={formData.mobilePhone}
                      onChange={(e) => handleFormChange("mobilePhone", e.target.value)}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Grid>  */}

                  {/* How Phone is Recharged */}
                  {/* <Grid item xs={12} sm={6}>
    <TextField
      fullWidth
      label="How do you recharge your phone?"
      value={formData.howPhoneIsRecharged}
      onChange={(e) => handleFormChange("howPhoneIsRecharged", e.target.value)}
    />
  </Grid>
</Grid>

                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="How do you recharge your phone?"
                      value={formData.howPhoneIsRecharged}
                      onChange={(e) => handleFormChange("howPhoneIsRecharged", e.target.value)}
                    >
                      <MenuItem value="Self">Self</MenuItem>
                      <MenuItem value="Recharged by others">Recharged by others</MenuItem>
                      <MenuItem value="Sometimes by self, sometimes by others">Sometimes by self, sometimes by others</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </>
            )} */}

            {step === 5 && (
              <>
                <Box sx={{ mt: 3, ml: 5 }}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      <u>Review Application</u>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}><b><u>A. BIODATA</u></b></Grid>
                  <Grid item xs={12} sm={12}><strong>NIN:</strong> {formData.nin}</Grid>
                  <Grid item xs={12} sm={12}><strong>Phone Number:</strong> {phoneNumber}</Grid>
                  <Grid item xs={12} sm={12}><strong>First Name:</strong> {firstName}</Grid>
                  <Grid item xs={12} sm={12}><strong>Last Name:</strong> {lastName}</Grid>
                  <Grid item xs={12} sm={12}><strong>Other Names:</strong> {otherNames}</Grid>
                  <Grid item xs={12} sm={12}><strong>Gender:</strong> {formData.gender}</Grid>
                  <Grid item xs={12} sm={12}><strong>Blood Group:</strong> {formData.bloodGroup}</Grid>
                  <Grid item xs={12} sm={12}><strong>Religion:</strong> {formData.religion}</Grid>
                  <Grid item xs={12} sm={12}><strong>Occupation:</strong> {formData.occupation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Address:</strong> {formData.address}</Grid>
                  <Grid item xs={12} sm={12}><strong>State of Origin:</strong> {stateOfOriginName}</Grid>
                  <Grid item xs={12} sm={12}><strong>State of Residence:</strong> {stateOfResidenceName}</Grid>
                  <Grid item xs={12} sm={12}><strong>Hospital of choice:</strong> {hospitalName}<i style={{ color: 'red' }}>&nbsp;(*Please note that this cannot be changed later)</i></Grid>
                  <Grid item xs={12} sm={12}><strong>Hospital File Number:</strong> {formData.hospitalFileNumber}</Grid>
                  <Grid item xs={12} sm={12}><strong>HMO:</strong> {patientHMOName}</Grid>
                  <Grid item xs={12} sm={12}><strong>HMO Number:</strong> {formData.hmoNumber}</Grid><br />

                  <Grid item xs={12} sm={12}><b><u>B. NEXT OF KIN</u></b></Grid>
                  <Grid item xs={12} sm={12}><strong>Next of Kin Name:</strong> {formData.nextOfKinName}</Grid>
                  <Grid item xs={12} sm={12}><strong>Next of Kin Phone Number:</strong> {formData.nextOfKinPhoneNumber}</Grid>
                  <Grid item xs={12} sm={12}><strong>Next of Kin Email:</strong> {formData.nextOfKinEmail}</Grid>
                  <Grid item xs={12} sm={12}><strong>Next of Kin Address:</strong> {formData.nextOfKinAddress}</Grid>
                  <Grid item xs={12} sm={12}><strong>Next of Kin Gender:</strong> {formData.nextOfKinGender}</Grid>
                  <Grid item xs={12} sm={12}><strong>Occupation of Next of Kin:</strong> {formData.nextOfKinOccupation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Relationship With Next of Kin:</strong> {formData.nextOfKinRelationship}</Grid>
                <br/>
                  <Grid item xs={12} sm={12}><b><u>C. PERSONAL HISTORY</u></b></Grid>
                  <Grid item xs={12} sm={12}><strong>Average Monthly Income:</strong> {formData.averageMonthlyIncome}</Grid>
                  <Grid item xs={12} sm={12}><strong>Average Feeding Cost Daily:</strong> {formData.averageFeedingDaily}</Grid>
                  <Grid item xs={12} sm={12}><strong>Who provides Feeding?:</strong> {formData.whoProvidesFeeding}</Grid>
                  <Grid item xs={12} sm={12}><strong>Accommodation Status:</strong> {formData.accomodation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Accommodation Type:</strong> {formData.typeOfAccomodation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Number of Good Set of Clothes:</strong> {formData.noOfGoodSetOfClothes}</Grid>
                  <Grid item xs={12} sm={12}><strong>How Are Clothes Gotten:</strong> {formData.howAreClothesGotten}</Grid>
                  <Grid item xs={12} sm={12}><strong>Hospital Currently Receiving Care:</strong> {formData.hospitalReceivingCare2}</Grid>
                  <Grid item xs={12} sm={12}><strong>Why Did You Choose This Hospital?:</strong> {formData.whyDidYouChooseHospital}</Grid>
                  <Grid item xs={12} sm={12}><strong>Level of Spousal Support:</strong> {formData.levelOfSpousalSpupport}</Grid>
                  <Grid item xs={12} sm={12}><strong>Other Support:</strong> {formData.otherSupport}</Grid>
                
                  <br/>
                  <Grid item xs={12} sm={12}><b><u>D. FAMILY HISTORY</u></b></Grid>
                  <Grid item xs={12} sm={12}><strong>Family Setup Size:</strong> {formData.familySetupSize}</Grid>
                  <Grid item xs={12} sm={12}><strong>Birth Order:</strong> {formData.birthOrder}</Grid>
                  <Grid item xs={12} sm={12}><strong>Father's Educational Level:</strong> {formData.fathersEducationalLevel}</Grid>
                  <Grid item xs={12} sm={12}><strong>Mother's Educational Level:</strong> {formData.mothersEducationalLevel}</Grid>
                  <Grid item xs={12} sm={12}><strong>Father's Occupation:</strong> {formData.fathersOccupation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Mother's Occupation:</strong> {formData.mothersOccupation}</Grid>
                  <Grid item xs={12} sm={12}><strong>Level of Family Care:</strong> {formData.levelOfFamilyCare}</Grid>
                  <Grid item xs={12} sm={12}><strong>Family Monthly Income:</strong> {formData.familyMonthlyIncome}</Grid>


                </Box>
                {/* <div className="flex justify-between mt-4">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleNext}>Proceed to Submit</Button>
          </div> */}
              </>
            )}

          </Grid>
          <Grid item xs={12} className="mt-4">
            {step > 1 && (
              <Button variant="outlined" color="secondary" onClick={prevStep}>
                Previous
              </Button>
            )}
            &nbsp;
            {step < 4 ? <Button variant="contained" color="primary" onClick={handleNextStep}>Next</Button> : <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : step === 5 ? "Submit" : "Next"}
            </Button>



            }&nbsp;
            {/* <Button variant="contained" color="info" onClick={handleSaveProgress} disabled={loading}>
  {loading ? <CircularProgress size={24} /> : "Save Progress"}
</Button> */}

          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default Biodata
