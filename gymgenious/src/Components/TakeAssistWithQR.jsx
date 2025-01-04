import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

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
          if (data.message) {  
            setSuccess(true);
          } else {
            setError("Error al registrar la asistencia.");
          }
          setLoading(false);  
        })
        .catch((error) => {
          setError("Error al registrar la asistencia.");
          setLoading(false);  
          console.error("Error:", error);
        });
    } else {
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, [token]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {loading && <CircularProgress />}  
      {error && <p style={{ color: 'red', fontSize: '18px' }}>{error}</p>} 
      {success && <p style={{ fontSize: '100px', color: 'green', fontWeight: 'bold' }}>EXITO</p>}  
      {!loading && !error && !success && <p>Marcando asistencia...</p>} 
    </div>
  );
};

export default MarkAttendance;
