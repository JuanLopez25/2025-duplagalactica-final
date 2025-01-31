import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx'
const Logout = () => {
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(true);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const handleLogout = () => {
      localStorage.removeItem('authToken');
      setTimeout(() => {
        setOpenCircularProgress(false);
        setSuccess(true);
      }, 1000);
      setTimeout(() => {
        setSuccess(false)
        navigate('/'); 
      }, 3000); 
    };
    const handleError = () => {
      setTimeout(() => {
        setOpenCircularProgress(false);
        setFailure(true);
      }, 1000);
      setTimeout(() => {
        setFailure(false);
        navigate('/'); 
      }, 3000); 
    };
    setTimeout(() => {
      if (token) {
        handleLogout();
      } else {
        handleError();
      }
    }, 500);
    
  }, [navigate]);

  return (
    <div className='App'>
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
                    Successful logout!
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
                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                    You are not logged in!
                  </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default Logout;
