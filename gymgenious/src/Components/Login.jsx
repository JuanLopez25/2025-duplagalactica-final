import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { auth } from '../firebase-config.js';
import {signInWithEmailAndPassword } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [errorLogin, setErrorLogin] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:700px)');

  const goToCreateAccount = () => {
    navigate('/create-account');
  };

  const goToResetPassword = () => {
    navigate('/forgot-password');
  };

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
      setTimeout(() => {
        setSuccess(false);
        navigate(`/`);
      }, 3000);
    } catch (error) {
      console.error("Login error:", error);
      setOpenCircularProgress(false);
      setErrorLogin(true)
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
      if (token) {
        navigate('/');
        return;
      } else {
        setIsAuthenticated(false);
        return;
      }
  }, []);

  return (
    <div className='full-screen-image-1'>
      {isAuthenticated ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <LeftBar value={'profile'}/>
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
                <div className='login-options'>
                  <button className='login-options-text' onClick={goToResetPassword}>Forgot password?</button>
                  <button className='login-options-text' onClick={goToCreateAccount}>Create account</button>     
                </div>
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
          { failure ? (
            <div className='alert-container'>
                <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                      <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Credentials or server error. Try again!</Alert>
                    </Slide>
                  </Box>
                </div>
            </div>
          ) : (
            null
          )}
        </>
      )}
    </div>
  );
}