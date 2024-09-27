import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const oobCode = query.get('code');
    const auth = getAuth();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [failureErrors, setFailureErrors] = useState(false);

    useEffect(() => {
      if (!oobCode) {
        navigate('/');
      }
    }, [oobCode, navigate]);
    
    const validateForm = () => {
      let errors = [];
      const hasNumber = /[0-9]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const isValidLength = password.length > 7;
      const samePasswords = password == passwordAgain;

      if (!isValidLength) {
        errors.push('The password must be more than 8 characters.');
      } 
      if (!hasNumber) {
          errors.push('The password must contain at least 1 number.');
      } 
      if (!hasLowerCase) {
          errors.push('The password must contain at least 1 lowercase letter.');
      } 
      if (!hasUpperCase) {
          errors.push('The password must contain at least 1 uppercase letter.');
      } 
      if (!hasSpecialChar) {
          errors.push('The password must contain at least 1 special character.');
      }
      if (!samePasswords) {
        errors.push('Passwords must be the same.');
      }

      setErrors(errors);
      return errors.length === 0;
  }
    const handleSubmit = async (e) => {
      setOpenCircularProgress(true);
      e.preventDefault();
      if(validateForm()){
        try {
          await confirmPasswordReset(auth, oobCode, password);
          setOpenCircularProgress(false);
          setSuccess(true);
          setTimeout(() => {
              setSuccess(false);
              navigate('/login');
              }, 3000);
        } catch (error) {
          console.error('Password reset error:', error);
          setOpenCircularProgress(false);
          setFailure(true);
          setTimeout(() => {
              setFailure(false);
              }, 3000);
        }
      } else {
          setOpenCircularProgress(false);
          setFailureErrors(true);
          setTimeout(() => {
              setFailureErrors(false);
              }, 3000);
      }
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordRequirements, setOpenPasswordRequirements] = useState(false);
    const handleOpenPasswordRequirements = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      setOpenPasswordRequirements(!openPasswordRequirements)
    };    
    const id = openPasswordRequirements ? 'simple-popper' : undefined;

    const [anchorEl2, setAnchorEl2] = useState(null);
    const [openPasswordRequirements2, setOpenPasswordRequirements2] = useState(false);
    const handleOpenPasswordRequirements2 = (event) => {
      setAnchorEl2(anchorEl2 ? null : event.currentTarget);
      setOpenPasswordRequirements2(!openPasswordRequirements2)
    };    
    const id2 = openPasswordRequirements2 ? 'simple-popper' : undefined;

    return (
    <div className='App'>
      {!oobCode ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
        <LeftBar value={'profile'}/>
        <div className='new-password-container'>
          <div className='new-password-content'>
            <h2>Reset password</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                  <label htmlFor="password">Password:</label>
                  <input
                      onClick={handleOpenPasswordRequirements}
                      type="password" 
                      id="password" 
                      name="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Popper id={id} open={openPasswordRequirements} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements}>
                        <p>The password must contain more than 8 characters.</p>
                        <p>The password must contain at least 1 number.</p>
                        <p>The password must contain at least 1 lowercase letter.</p>
                        <p>The password must contain at least 1 uppercase letter.</p>
                        <p>The password must contain at least 1 special character.</p>
                    </Box>
                </Popper>
              </div>
              <div className="input-container">
                  <label htmlFor="password">Confirm password:</label>
                  <input
                      onClick={handleOpenPasswordRequirements2}
                      type="password" 
                      id="password" 
                      name="password" 
                      value={passwordAgain} 
                      onChange={(e) => setPasswordAgain(e.target.value)} 
                  />
              </div>
              <Popper id={id2} open={openPasswordRequirements2} anchorEl={anchorEl2}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenPasswordRequirements2}>
                        <p>Passwords must be the same</p>
                    </Box>
                </Popper>
              <button type="submit" className='button_create_account'>
                  Confirm new password
              </button>
            </form>
          </div>
        </div>
            {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <CircularProgress color="inherit" />
                </Backdrop>
            ) : null}
            { success ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                              Password reset successfully 
                            </Alert>
                          </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { failureErrors ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                        <div>
                            <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                              Password reset error
                            </Alert>
                            {errors.length > 0 && errors.map((error, index) => (
                            <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                                <li>{error}</li>
                            </Alert>
                            ))}
                        </div>
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
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Password reset error</Alert>
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
