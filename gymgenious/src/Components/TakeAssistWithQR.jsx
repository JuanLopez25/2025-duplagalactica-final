import '../App.css';
import { useLocation } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';  // Este es el ícono de éxito
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress'; // Agregado para el cargador
import Alert from '@mui/material/Alert'; 

const MarkAttendance = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      fetch(`https://two025-duplagalactica-final.onrender.com/attendance?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.message) {
            setSuccess(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          setError("Error al registrar la asistencia.");
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, [token]);

  return (
    <div className='full-screen-image-login'>
      {loading ? (
        <CircularProgress /> 
      ) : success ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                    Assistance checked correctly
                  </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : error ? (
        <div className='alert-container'>
              <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Slide direction="up" in={error} mountOnEnter unmountOnExit >
                        <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                            Error while checking assitance, please try again
                        </Alert>
                    </Slide>
                  </Box>
              </div>
        </div>
      ) : (
        <p>Marcando asistencia...</p>  // Mensaje por defecto mientras se está procesando
      )}
    </div>
  );
};

export default MarkAttendance;
