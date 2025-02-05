import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { Button, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from "sweetalert2";

const DualSketchpad = () => {
  const rightEyeFrontRef = useRef(null);
  const rightEyeBackRef = useRef(null);
  const leftEyeFrontRef = useRef(null);
  const leftEyeBackRef = useRef(null);
  const [brushColor, setBrushColor] = useState("#000000"); // Default black brush
  const [brushRadius, setBrushRadius] = useState(1); // Default brush size


  const searchParams = useSearchParams();
  const router = useRouter();
  const patientId = searchParams.get('patientId');
  const patientName = searchParams.get('patientName');
  const encounterId = searchParams.get('encounterId');
  const [loading, setLoading] = useState(false);
  const saveSketches = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sketches = {
        rightEyeFront: rightEyeFrontRef.current.getSaveData(),
        rightEyeBack: rightEyeBackRef.current.getSaveData(),
        leftEyeFront: leftEyeFrontRef.current.getSaveData(),
        leftEyeBack: leftEyeBackRef.current.getSaveData(),
        patientId: patientId,
        encounterId: encounterId
      };
  
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/sketch`, sketches);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Data submitted successfully!',
        timer: 3000,
        showConfirmButton: false,
      });
      router.push(
        `/dashboard/encounters/investigation?patientId=${patientId}&patientName=${patientName}&encounterId=${encounterId}`
      );
    } catch (error) {
      console.error("Error saving sketches:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while submitting data.',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };
  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      padding={2}
    >
      <Typography variant="h4" marginBottom={3}>
        Dual Sketchpad
      </Typography>

      {/* Sketchpads */}
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gridGap={32}
        width="100%"
      >
        {/* Right Eye Front */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" marginBottom={1}>
            Right Eye Front
          </Typography>
          <CanvasDraw
            ref={rightEyeFrontRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            canvasWidth={300}
            canvasHeight={300}
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => rightEyeFrontRef.current.clear()}
          >
            Clear Right Eye Front
          </Button>
        </Box>

        {/* Right Eye Back */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" marginBottom={1}>
            Right Eye Back
          </Typography>
          <CanvasDraw
            ref={rightEyeBackRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            canvasWidth={300}
            canvasHeight={300}
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => rightEyeBackRef.current.clear()}
          >
            Clear Right Eye Back
          </Button>
        </Box>

        {/* Left Eye Front */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" marginBottom={1}>
            Left Eye Front
          </Typography>
          <CanvasDraw
            ref={leftEyeFrontRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            canvasWidth={300}
            canvasHeight={300}
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => leftEyeFrontRef.current.clear()}
          >
            Clear Left Eye Front
          </Button>
        </Box>

        {/* Left Eye Back */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" marginBottom={1}>
            Left Eye Back
          </Typography>
          <CanvasDraw
            ref={leftEyeBackRef}
            brushColor={brushColor}
            brushRadius={brushRadius}
            canvasWidth={300}
            canvasHeight={300}
          />
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: "8px" }}
            onClick={() => leftEyeBackRef.current.clear()}
          >
            Clear Left Eye Back
          </Button>
        </Box>
      </Box>

      {/* Brush Controls */}
      <Box display="flex" flexDirection="column" alignItems="center" marginTop={3}>
        <Typography variant="h6">Brush Controls</Typography>
        <Box display="flex" gap={2} marginTop={1}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#ff0000", color: "#fff" }}
            onClick={() => setBrushColor("#ff0000")}
          >
            Red
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#0000ff", color: "#fff" }}
            onClick={() => setBrushColor("#0000ff")}
          >
            Blue
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#008000", color: "#fff" }}
            onClick={() => setBrushColor("#008000")}
          >
            Green
          </Button>
        </Box>
      </Box>

      {/* Save Button */}
      <Box marginTop={3}>
        {/* <Button
          variant="contained"
          color="primary"
          onClick={saveSketches}
        >
          Save Sketches
        </Button> */}

        <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={saveSketches}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
      </Box>
    </Box>
  );
};

export default DualSketchpad;
