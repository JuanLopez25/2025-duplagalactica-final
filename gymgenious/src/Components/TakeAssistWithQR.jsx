import '../App.css';
import { useLocation } from "react-router-dom"; 
import React, { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';  
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert'; 
import verifyToken from '../fetchs/verifyToken';
import { useMediaQuery } from '@mui/material';
import { auth } from '../firebase-config.js';
import { useNavigate } from 'react-router-dom';
import {signInWithEmailAndPassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import Loader from '../real_components/loader.jsx';

const MarkAttendance = () => {
  const location = useLocation();
  const [error, setError] = useState(null);
  const [errorClass, setErrorClass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successLecture,setSuccessLecture] = useState(false)
  const [logeedIn, setLogin] = useState(false)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [newToken,setNewToken] = useState(null)
  const params = new URLSearchParams(location.search);
  const [userMail,setUserMail] = useState(null);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const token = params.get("token");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:700px)');

  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,()=>{},setUserMail,()=>{});
    } else {
        console.error('No token found');
    }
    
  },[logeedIn]);


  useEffect(() => {
    let token = localStorage.getItem('authToken');
    if (token) {
      setLogin(true)
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
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!response2.ok) {
          throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data2 = await response2.json();       
        const filteredClasses = data2
        .filter(event => event.BookedUsers.includes(userMail))
        .map(event => event.id);
        console.log("estas son las filtered class",filteredClasses)
        if (filteredClasses.includes(eventId)) {
          const response = await fetch(`https://two025-duplagalactica-final.onrender.com/generate-token-userSide/${eventId}/${dateFin}/${dateInicio}/${mailUsuario}`);
          const data = await response.json();
          setNewToken(data.token);
        } else {
          setErrorClass(true)
          setTimeout(() => {
            setErrorClass(false)            
            navigate(`/`);
          }, 3000);
        }
      } catch (error) {
        console.error("Error al obtener el token:", error);
      }
    };
    if (token && userMail && logeedIn) {
      fetchToken();
    }
  },[token,userMail,logeedIn])

  useEffect(() => {
    if (newToken && logeedIn) {
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
              setSuccessLecture(true)
              setLoading(false);
              setTimeout(() => {
                navigate(`/`);
              }, 3000);              
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
  }, [newToken,logeedIn]);

  const loginUser = async (e) => {
    setVerifyEmail(false);
    setErrorLogin(false)
    setOpenCircularProgress(true);
    e.preventDefault(); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setOpenCircularProgress(false);
        setVerifyEmail(true);
        return;
      }
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      console.log('Token almacenado:', localStorage.getItem('authToken'));
      setOpenCircularProgress(false);
      setSuccess(true);
      setLogin(true)
    } catch (error) {
      console.error("Login error:", error);
      setOpenCircularProgress(false);
      setErrorLogin(true)
    }
  };

  return (
    <div className='full-screen-image-login'>
      {!logeedIn && (
        <>
        <div className='login-container'>
              <div className='login-content'>
                <h2 style={{color:'#424242'}}>Login</h2>
                <form onSubmit={loginUser}>
                  <div className="input-container">
                    <label htmlFor="username" style={{color:'#424242'}}>Email:</label>
                    <input 
                      type="text" 
                      id="username" 
                      name="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      style={{color:'#283618'}}
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="password" style={{color:'#424242'}}>Password:</label>
                    <input 
                    color='#283618'
                      type="password" 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                  {errorLogin && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Credentials or server error</p>)}
                  {verifyEmail && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Please verify your mail</p>)}
                  <button type="submit" className='button_login' style={{width: isSmallScreen ? '70%' : '40%'}}>
                    Login
                  </button>
                </form>
              </div>
            </div>
          {openCircularProgress ? (
            <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openCircularProgress}
            >
              <Loader></Loader>
            </Backdrop>
          ) : null}
          { success ? (
            <div className='alert-container'>
              <div className='alert-content'>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                        Successful login!
                      </Alert>
                  </Slide>
                </Box>
              </div>
            </div>
          ) : (
            null
          )}
        </>
      ) 
      }
      <>
        { errorClass ? (
          <div className='alert-container'>
            <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Slide direction="up" in={errorClass} mountOnEnter unmountOnExit >
                    <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                      The user is not in this class
                    </Alert>
                </Slide>
              </Box>
            </div>
          </div>
        ) : (
          null
        )}
      {loading && (
        <Loader></Loader>
      )}
      {successLecture ? (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={successLecture} mountOnEnter unmountOnExit >
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
        <p>Marcando asistencia...</p> 
      )}
        </>
    </div>
  );
};

export default MarkAttendance;