'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Modal,
  Box,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Print, Visibility } from '@mui/icons-material';
import axios from 'axios';

type VisualAcuity = {
  id: number;
  name: string;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type Patient = {
  id: number;
  patientId: string;
  hospitalFileNumber: string;
  firstName: string;
  lastName: string;
  otherNames?: string | null;
  gender: string;
  bloodGroup: string;
  occupation?: string | null;
  dateOfBirth: string;
  address?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

type Encounter = {
  encounterId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  patient: Patient;
  visualAcuityFarPresentingLeft?: VisualAcuity | null;
  visualAcuityFarPresentingRight?: VisualAcuity | null;
  intraOccularPressureRight: string | null;
  intraOccularPressureLeft: string | null;
  detailedHistoryRight: string | null;
  detailedHistoryLeft: string | null;
  findingsRight: string | null;
  findingsLeft: string | null;
  // Add other fields here...
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const EncountersTable = () => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [filteredEncounters, setFilteredEncounters] = useState<Encounter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [selectedPatientEncounters, setSelectedPatientEncounters] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  useEffect(() => {
    const fetchEncounters = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/encounters`);
        setEncounters(response.data);
        setFilteredEncounters(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load encounters data.');
        setLoading(false);
      }
    };

    fetchEncounters();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = encounters.filter((encounter) => {
      const fullName = `${encounter.firstName || ''} ${encounter.lastName || ''} ${encounter.otherNames || ''}`.toLowerCase();

      return fullName.includes(query);
    });

    setFilteredEncounters(filtered);
    setPage(0); // Reset to the first page after search
  };

  const handleView = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const encountersList = (encounter) => {
    setSelectedPatientName(`${encounter.firstName} ${encounter.lastName}`);
    setSelectedPatientEncounters(encounter.encounters); // Make sure to have an 'encounters' array for each patient.
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const displayedEncounters = filteredEncounters.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <h3>Encounters</h3>
      <TextField
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Encounter Date</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {displayedEncounters.map((encounter) => ( */}
            {displayedEncounters.map((encounter, index) => (
              <TableRow key={encounter.encounterId}>
                <TableCell>{formatDate(encounter.created_at)}</TableCell>
                <TableCell>{encounter.firstName} {encounter.lastName}</TableCell>
                <TableCell>{encounter.gender}</TableCell>
                <TableCell>{encounter.bloodGroup}</TableCell>
                <TableCell>
                  <IconButton onClick={() => encountersList(encounter)} color="primary">
                    <Visibility />
                  </IconButton>

                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredEncounters.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>



 {/* Modal to show patient encounters */}
 <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPatientName}'s Encounters</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Encounter Date</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedPatientEncounters.map((encounter, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(encounter?.created_at)} at {new Date(encounter?.created_at).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                    <IconButton onClick={() => handleView(encounter)} color="primary">
                    <Visibility />
                  </IconButton>
                  {/* <IconButton color="primary">
                    <Print />
                  </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="primary">
            Close
          </IconButton>
        </DialogActions>
      </Dialog>

   {/* Modal to view patient details */}
<Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <Box sx={modalStyle}>
    {selectedEncounter && (
      <div>
        {/* Biodata */}
        <h1>Encounter Date: {formatDate(selectedEncounter?.created_at)}</h1>
        {/* <p><strong>Full Name:</strong> {selectedEncounter?.firstName} {selectedEncounter?.lastName}</p>
        <p><strong>Gender:</strong> {selectedEncounter?.gender}</p>
        <p><strong>Hospital File Number:</strong> {selectedEncounter?.hospitalFileNumber}</p> */}

        {/* Eye and Pressure Data */}
        <h2>Consulting Information</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Right Eye</strong></TableCell>
              <TableCell><strong>Left Eye</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><strong>Visual Acuity Far Presenting</strong></TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_presenting_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_presenting_left?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Visual Acuity Far Pinhole</strong></TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_pinhole_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_pinhole_left?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Visual Acuity Far Best Corrected</strong></TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_best_corrected_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_far_best_corrected_left?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Visual Acuity Near</strong></TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_near_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.consulting?.visual_acuity_near_left?.name}</TableCell>
            </TableRow>
            </TableBody>
        </Table>

        <h2>Other Consulting Information</h2>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Right Eye</strong></TableCell>
              <TableCell><strong>Left Eye</strong></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
        
       
        <TableRow>
              <TableCell><strong>Intraocular Pressure</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.intraOccularPressureRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.intraOccularPressureLeft}</TableCell>
            </TableRow>
           

            <TableRow>
              <TableCell><strong>Other Complaints</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.otherComplaintsRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.otherComplaintsLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Detailed History</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.detailedHistoryRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.detailedHistoryLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Findings</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.findingsRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.findingsLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Eyelid</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.eyelidRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.eyelidLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Conjunctiva</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.conjunctivaRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.conjunctivaLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Cornea</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.corneaRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.corneaRight}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>AC</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.ACRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.ACLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Iris</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.irisRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.irisLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Pupil</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.pupilRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.pupilLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Lens</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.lensRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.lensLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Vitreous</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.vitreousRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.vitreousLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Retina</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.retinaRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.retinaLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Other Findings</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.otherFindingsRight}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.otherFindingsLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Chief Complaint</strong></TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.chief_complaint_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.continue_consulting?.chief_complaint_left?.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        
      
        {/* Refraction Data */}
        <h2>Refraction Information</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Right Eye</strong></TableCell>
              <TableCell><strong>Left Eye</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody> 
          

            <TableRow>
              <TableCell><strong>Near Add</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.nearAddRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.nearAddLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>OCT</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.OCTRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.OCTLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>FFA</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.FFARight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.FFALeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Fundus Photography</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.fundusPhotographyRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.fundusPhotographyLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Pachymetry</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.pachymetryRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.pachymetryLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>CUFT</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.CUFTRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.CUFTLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>CUFT Kinetic</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.CUFTKineticRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.CUFTKineticLeft}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Pupil</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.pupilRight}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.pupilLeft}</TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell><strong>Sph (Sphere)</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.sphere_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.sphere_left?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Cyl (Cylinder)</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.cylinder_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.cylinder_right?.name}</TableCell>
            </TableRow>
            <TableRow>
  <TableCell><strong>Axis</strong></TableCell>
  <TableCell dangerouslySetInnerHTML={{ __html: selectedEncounter?.refractions?.axis_right?.name }} />
  <TableCell dangerouslySetInnerHTML={{ __html: selectedEncounter?.refractions?.axis_left?.name }} />
</TableRow>

            <TableRow>
              <TableCell><strong>Prism</strong></TableCell>
              <TableCell>{selectedEncounter?.refractions?.prism_right?.name}</TableCell>
              <TableCell>{selectedEncounter?.refractions?.prism_left?.name}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h2>Sketches</h2>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Right Eye</strong></TableCell>
              <TableCell><strong>Left Eye</strong></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
        <TableRow>
  <TableCell><strong>Front</strong></TableCell>
  <TableCell>
    <img 
      src={`${process.env.NEXT_PUBLIC_APP_URL}/storage/${selectedEncounter?.sketches?.right_eye_front}`} 
      alt="Right Eye Front" 
      style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
    />
  </TableCell>
  <TableCell>
    <img 
      src={`${process.env.NEXT_PUBLIC_APP_URL}/storage/${selectedEncounter?.sketches?.left_eye_front}`} 
      alt="Left Eye Front" 
      style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
    />
  </TableCell>
</TableRow>

<TableRow>
  <TableCell><strong>Back</strong></TableCell>
  <TableCell>
    <img 
      src={`${process.env.NEXT_PUBLIC_APP_URL}/storage/${selectedEncounter?.sketches?.right_eye_back}`} 
      alt="Right Eye Front" 
      style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
    />
  </TableCell>
  <TableCell>
    <img 
      src={`${process.env.NEXT_PUBLIC_APP_URL}/storage/${selectedEncounter?.sketches?.left_eye_back}`} 
      alt="Left Eye Front" 
      style={{ width: '100px', height: 'auto' }} // Adjust the size as needed
    />
  </TableCell>
</TableRow>

          </TableBody>
        </Table>


        <h2>Diagnoses</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Right Eye</strong></TableCell>
              <TableCell><strong>Left Eye</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          
          <TableRow>
              <TableCell><strong>Diagnosis</strong></TableCell>
              <TableCell>{selectedEncounter?.diagnoses?.diagnosis_right_details?.name}</TableCell>
              <TableCell>{selectedEncounter?.diagnoses?.diagnosis_left_details?.name}</TableCell>
            </TableRow>
         </TableBody>
         </Table>

        <h2>Treatment</h2>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell><strong>Medicine Type</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Dosage</strong></TableCell>
              <TableCell><strong>Dose Duration</strong></TableCell>
              <TableCell><strong>Dose Interval</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Comment</strong></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
        <TableRow>
              <TableCell>{selectedEncounter?.treatments?.treatmentType}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.medicine}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.dosage}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.doseDuration}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.doseInterval}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.time}</TableCell>
              <TableCell>{selectedEncounter?.treatments?.comment}</TableCell>
            </TableRow>
        </TableBody>
        </Table>

  <h2>Investigation Details</h2>
        <Table>
        <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Response</strong></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
        <TableRow>
              <TableCell>Investigations Required</TableCell>
              <TableCell>{selectedEncounter?.investigations?.investigationsRequired}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>External Investigations Required</TableCell>
              <TableCell>{selectedEncounter?.investigations?.externalInvestigationRequired}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>Investigations Done</TableCell>
              <TableCell>{selectedEncounter?.investigations?.investigationsDone}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>HBP</TableCell>
              <TableCell>{selectedEncounter?.investigations?.HBP}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>Diabetes</TableCell>
              <TableCell>{selectedEncounter?.investigations?.diabetes}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>Pregnancy</TableCell>
              <TableCell>{selectedEncounter?.investigations?.pregnancy}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>Drug Allergy</TableCell>
              <TableCell>{selectedEncounter?.investigations?.drugAllergy}</TableCell>
        </TableRow>

        <TableRow>
              <TableCell>Current Medication</TableCell>
              <TableCell>{selectedEncounter?.investigations?.currentMedication}</TableCell>
        </TableRow>

        </TableBody>
        </Table>
        {/* Appointment Information */}
        {/* <h2>Appointment Details</h2> */}
        <br/><h3><strong>Next Appointment:</strong> {selectedEncounter?.appointments?.appointmentDate} at {selectedEncounter?.appointments?.appointmentTime}</h3>
     
    
        {/* Close Button */}
        <Button onClick={() => setOpenViewModal(false)}>Close</Button>
      </div>
    )}
  </Box>
</Modal>


    </>
  );
};

export default EncountersTable;
