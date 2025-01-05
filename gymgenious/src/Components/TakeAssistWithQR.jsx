import '../App.css';
import { useLocation } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';  // Este es el ícono de éxito
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress'; // Agregado para el cargador
import Alert from '@mui/material/Alert'; 
import {jwtDecode} from "jwt-decode";

const MarkAttendance = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newToken,setNewToken] = useState(null)
  const params = new URLSearchParams(location.search);
  const [userMail,setUserMail] = useState(null);
  const token = params.get("token");
  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
    } catch (error) {
        
    }
  };

  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
    
  });

  useEffect(()=>{
    const fetchToken = async () => {
      try {
        const tokenDataResponse = await fetch(`https://two025-duplagalactica-final.onrender.com/get_decoded_token?token=${token}`);
        const dataToken = await tokenDataResponse.json()
        const eventId=dataToken.eventId
        const mailUsuario=userMail
        const dateInicio = dataToken.start
        const dateFin = dataToken.end
        console.log("asi se ve la data",dataToken)
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/generate-token-userSide/${eventId}/${dateFin}/${dateInicio}/${mailUsuario}`);
        const data = await response.json();
        setNewToken(data.token);
      } catch (error) {
        console.error("Error al obtener el token:", error);
      }
    };
    if (token && userMail) {
      fetchToken();
    }
  },[token,userMail])

  useEffect(() => {
    if (newToken) {
      try {
        fetch(`https://two025-duplagalactica-final.onrender.com/attendance?token=${newToken}`, {
          method: "POST",
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
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Token inválido.");
      }
    }
  }, [newToken]);


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
