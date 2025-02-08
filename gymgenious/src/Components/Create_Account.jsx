import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import LeftBar from '../real_components/NewLeftBar.jsx';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typeAccount,setTypeAccount] = useState('')
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const auth = getAuth();
    const [errorLastName, setErrorLastName] = useState(false);
    const [errorMail, setErrorMail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const id = openPasswordRequirements ? 'simple-popper' : undefined;
    const [errorType, setErrorType] = useState(false);
    const [errorEmailRepeated, setErrorEmailRepeated] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [anchorEl, setAnchorEl] = useState(null);
    const [openPasswordRequirements, setOpenPasswordRequirements] = useState(false);

    const validateForm = () => {
        let errors = [];
        
        if (name === '') {
            errors.push('Please enter a valid name.');
            setErrorName(true);
        } else {
            setErrorName(false);
        }

        if (lastName === '') {
            errors.push('Please enter a valid last name.');
            setErrorLastName(true);
        } else {
            setErrorLastName(false);
        }

        const today = new Date();
        const inputDate = new Date(date);
        if (inputDate >= today || date === '') {
            errors.push('Please enter a valid birthdate.');
            setErrorDate(true);
        } else {
            setErrorDate(false);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email.');
            setErrorMail(true);
        } else {
            setErrorMail(false);
        }

        const hasNumber = /[0-9]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length > 7;

        if(!(hasNumber && hasLowerCase && hasUpperCase && hasSpecialChar && isValidLength)){
            errors.push('Please enter a valid password.');
            setErrorPassword(true);
        } else {
            setErrorPassword(false);
        }

        if(typeAccount===''){
            errors.push('Please enter a type of account');
            setErrorType(true);
        } else {
            setErrorType(false);
        }
        return errors.length === 0;
    }

    const handleCreateAccount = async () => {
        setErrorEmailRepeated(false);
        setOpenCircularProgress(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const newUser = {
                    uid: firebaseUser.uid,
                    Name: name,
                    Lastname: lastName,
                    Mail: email,
                    Birthday: date,
                    Gemas: 0,
                    MissionsComplete:0,
                    type: typeAccount
                };
                await fetch('https://two025-duplagalactica-final.onrender.com/create_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
                await sendEmailVerification(firebaseUser, {
                    url: 'https://2025-duplagalactica-final.vercel.app/redirections?mode=verifyEmail', 
                    handleCodeInApp: true
                });
                setOpenCircularProgress(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    navigate('/'); 
                }, 3000);
            } catch (error) {
                setOpenCircularProgress(false);
                if (error.code === 'auth/email-already-in-use') {
                    setErrorEmailRepeated(true);
                } else {
                    console.error("Error creating account:", error);
                    setFailure(true);
                    setTimeout(() => {
                        setFailure(false);
                        }, 3000);
                }
            }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
          navigate('/');
        } 
      }, []);

    const handleSubmit = (e) => {
        if(validateForm()){
            e.preventDefault();
            handleCreateAccount();
        }
    };

    const handleOpenPasswordRequirements = (event) => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
      setOpenPasswordRequirements(!openPasswordRequirements)
    };

    return (
        <div className='App'>
          <>
            <LeftBar value={'profile'}/>
            <div className='create-account-container-new'>
                <div className='create-account-content'>
                    <h2 style={{color:'#424242'}}>Create account</h2>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#424242'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            {errorName && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a name</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="lastName" style={{color:'#424242'}}>Last name:</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                            />
                            {errorLastName && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a last name</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="date" style={{color:'#424242'}}>Birthdate:</label>
                            <input 
                                type="date" 
                                id="date" 
                                name="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                            {errorDate && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a valid date</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#424242'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            {errorMail && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a email</p>)}
                            {errorEmailRepeated && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>An account already exists with this email</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#424242'}}>Password:</label>
                            <input
                                onClick={handleOpenPasswordRequirements}
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errorPassword && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a valid password</p>)}
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
                            <label htmlFor="typeAccount" style={{color:'#424242'}}>Type of account:</label>
                            <select
                                type="typeAccount" 
                                id="typeAccount" 
                                name="typeAccount" 
                                value={typeAccount} 
                                onChange={(e) => setTypeAccount(e.target.value)} 
                            >
                                <option value="" >Select</option>
                                <option value="client">client</option>
                                <option value="coach">coach</option>
                            </select>
                            {errorType && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a type</p>)}
                        </div>
                        <button className='button_create_account' onClick={handleSubmit} style={{width: isSmallScreen ? '70%' : '40%'}}>
                            Create account
                        </button>
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
                                    Account successfully created!
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
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating account. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            </>
        </div>
    );
}
