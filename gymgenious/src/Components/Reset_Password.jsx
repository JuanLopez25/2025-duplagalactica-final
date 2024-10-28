import '../App.css';
import React, { useState } from 'react';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { getAuth,sendPasswordResetEmail } from 'firebase/auth';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [showNotMatchEmail, setShowNoMatchEmail] = useState(false);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [warningResettingPassword, setWarningResettingPassword] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const auth = getAuth();
    const handleSubmit = async (e) => {
        setOpenCircularProgress(true);
        e.preventDefault();
        try {
            const url = new URL('https://2024-duplagalactica.vercel.app/get_unique_user_by_email');
            url.searchParams.append('mail', email); 
            await sendPasswordResetEmail(auth, email, {
                url: 'https://2024-duplagalactica.vercel.app/redirections?mode=resetPassword', 
                handleCodeInApp: true
            });
            setOpenCircularProgress(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate('/');
            }, 3000);
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