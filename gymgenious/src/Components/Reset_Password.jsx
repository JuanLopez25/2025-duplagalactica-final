import '../App.css';
import React, {useState, useEffect} from 'react';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import fetchUser from '../fetchs/fetchUser.jsx'
import verifyToken from '../fetchs/verifyToken.jsx';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [errorToken,setErrorToken] = useState(false);
    const [notEmail,setNotEmail] = useState(false)
    const [userMail,setUserMail] = useState(null)
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [warningResettingPassword, setWarningResettingPassword] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [warningConnection, setWarningConnection] = useState(false);
    const auth = getAuth();
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
        } else {
            console.error('No token found');
        }
      }, []);
    
      useEffect(() => {
        if (userMail) {
            fetchUser(()=>{},setOpenCircularProgress,userMail,setWarningConnection);
        }
      }, [userMail]);


    const handleSubmit = async (e) => {
        setOpenCircularProgress(true);
        e.preventDefault();
        try {
            if (email==userMail) {
                await sendPasswordResetEmail(auth, email, {
                    url: 'https://2025-duplagalactica-final.vercel.app/redirections?mode=resetPassword', 
                    handleCodeInApp: true
                });
                setOpenCircularProgress(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/');
                }, 3000);
            } else {
                setOpenCircularProgress(false);
                setNotEmail(true)
            }
        } catch (error) {
            console.error("Error sending email:", error);
            setOpenCircularProgress(false);
            if (error.code === 'auth/invalid-email') {
                setFailure(true);
                setTimeout(() => {
                    setFailure(false);
                }, 3000);
            } else {
                setWarningResettingPassword(true);
                setTimeout(() => {
                    setWarningResettingPassword(false);
                    }, 3000);
            }
        }
    };

    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <Loader></Loader>
                </Backdrop>
            ) : null}
            {errorToken ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                                    Invalid Token!
                                </Alert>
                            </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            {warningConnection ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                            Connection Error. Try again later!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            <div className='reset-password-container'>
                <div className='reset-password-content'>
                    <h2 style={{color:'#424242'}}>Reset password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#424242'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                            {notEmail && (<p style={{color: 'red', margin: '0px'}}>That is not the email associated to this account</p>)}
                        </div>
                        <button type="submit" className='button_create_account' style={{width: isSmallScreen ? '70%' : '40%'}}>
                            Send email
                        </button>
                         { success ? (
                            <div className='alert-container'>
                                <div className='alert-content'>
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                                                Email sent successfully!
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
                                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>
                                            This account does not exist!
                                        </Alert>
                                    </Slide>
                                </Box>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                        { warningResettingPassword ? (
                            <div className='alert-container'>
                                <div className='alert-content'>
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <Slide direction="up" in={warningResettingPassword} mountOnEnter unmountOnExit >
                                        <Alert severity="info" style={{fontSize:'100%', fontWeight:'bold'}}>
                                            Error sending email. Try again!
                                        </Alert>
                                    </Slide>
                                </Box>
                                </div>
                            </div>
                        ) : (
                            null
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}