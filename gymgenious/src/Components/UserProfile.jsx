import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Loader from '../real_components/loader.jsx'
import { useMediaQuery } from '@mui/material';
import verifyToken from '../fetchs/verifyToken.jsx';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [nameFetch, setNameFetch] = useState('');
    const [lastNameFetch, setLastNameFetch] = useState('');
    const [dateFetch, setDateFetch] = useState('');
    const [emailFetch, setEmailFetch] = useState('');
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [user, setUser] = useState({});
    const [userMail, setUserMail] = useState('');
    const [errorToken,setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [warningFetchingUserInformation, setWarningFetchingUserInformation] = useState(false);
    const [warningModifyingData, setWarningModifyingData] = useState(false);
    const [errorForm, setErrorForm] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    
    const fetchUserInformation = async () => {
        setOpenCircularProgress(true);
        try {
            
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_users`, {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            })
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) => row.Mail === userMail);
            setNameFetch(filteredRows[0].Name);
            setLastNameFetch(filteredRows[0].Lastname);
            setEmailFetch(filteredRows[0].Mail);
            setDateFetch(filteredRows[0].Birthday);
            setUser(filteredRows[0]);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error("Error fetching user:", error);
            setOpenCircularProgress(false);
            setWarningFetchingUserInformation(true);
            setTimeout(() => {
                setWarningFetchingUserInformation(false);
            }, 3000);
        }
    };      

    const fetchModifyUserInformation = async () => {
        setOpenCircularProgress(true);
        try {
            const updatedUser = {
                ...user,
                Name: name || nameFetch,
                Lastname: lastName || lastNameFetch,
                Birthday: date || dateFetch,
                Mail: email || emailFetch
            };

            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_users_info', {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ newUser: updatedUser })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            fetchUserInformation();
            setOpenCircularProgress(false);
        } catch (error) {
            console.error("Error updating user:", error);
            setOpenCircularProgress(false);
            setWarningModifyingData(true);
            setTimeout(() => {
                setWarningModifyingData(false);
            }, 3000);
        }
    };

    const handleChangeModify = () => {
        setIsDisabled(!isDisabled);
        setName('');
        setLastName('');
        setDate('');
        setErrorForm(false);
    };

    const goToChangePassword = () => {
        navigate('/reset-password');
    };

    const validateForm = () => {
        let res = true;
        if (name === '' && lastName === '' && date === '') {
            setErrorForm(true);
            res = false;
        } else {
            setErrorForm(false);
        }
        return res;
    }

    const handleSave = (event) => {
        if(validateForm()){
            event.preventDefault(); 
            fetchModifyUserInformation();
            setIsDisabled(!isDisabled);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
        } else {
            navigate('/');
            console.error('No token found');
        }
    }, []);

    useEffect(() => {
        if(userMail){
            fetchUserInformation();
        }
    }, [userMail]);

    return (
        <div className='App'>
            {!userMail ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
                >
                    <Loader></Loader>
                </Backdrop>
            ) : (
            <>
                <LeftBar/>
                {openCircularProgress ? (
                    <Backdrop
                    sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                    open={openCircularProgress}
                    ><Loader></Loader>
                    </Backdrop>
                ) : null}
                { errorToken ? (
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
                { warningFetchingUserInformation ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningFetchingUserInformation} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Error fetching user information. Try again!
                                </Alert>
                            </Slide>
                            </Box>
                        </div>
                    </div>
                ) : (
                    null
                )}
                { warningModifyingData ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningModifyingData} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Error modifying user information. Try again!
                                </Alert>
                            </Slide>
                            </Box>
                        </div>
                    </div>
                ) : (
                    null
                )}
                <div className='user-profile-container'>
                <section style={{ backgroundColor: '#eee', borderRadius: '8px'}}>
    <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
                <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'100%'}}>
                  <MDBCard className="mb-4">
                  <MDBCardBody>
                    <MDBRow>
                        <MDBCol>
                            <div className="input-container-profile">
                                <label htmlFor="name" style={{ color: '#14213D' }}>Name:</label>
                                <input
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isDisabled}
                                    placeholder={nameFetch}
                                />
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <hr style={{color:'#14213D'}}/>
                    <MDBRow>
                        <MDBCol>
                            <div className="input-container-profile">
                                <label htmlFor="lastName" style={{ color: '#14213D' }}>Last name:</label>
                                <input
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    disabled={isDisabled}
                                    placeholder={lastNameFetch}
                                />
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <hr style={{color:'#14213D'}}/>
                    <MDBRow>
                        <MDBCol>
                            <div className="input-container-profile">
                                <label htmlFor="date" style={{ color: '#14213D' }}>Birthdate:</label>
                                <input
                                    type='date'
                                    id='date'
                                    name='date'
                                    value={date || dateFetch}
                                    onChange={(e) => setDate(e.target.value)}
                                    disabled={isDisabled}
                                />
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <hr style={{color:'#14213D'}}/>
                    <MDBRow>
                        <MDBCol>
                            <div className="input-container-profile">
                                <label htmlFor="email" style={{ color: '#14213D' }}>Email:</label>
                                <input
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}
                                    id="email"
                                    name="email"
                                    value={email}
                                    type='text'
                                    placeholder={emailFetch}
                                    disabled={true}
                                />                                
                                {errorForm && (<p style={{color: 'red', margin: '0px'}}>There are no changes</p>)}
                            </div>
                        </MDBCol>
                    </MDBRow>
                    <hr style={{color:'#14213D'}}/>
                    {isDisabled ? (
                                <>
                                    <button className='button_create_account' style={{width: isSmallScreen ? '70%' : ''}} type="button" onClick={handleChangeModify}>
                                        Modify data
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className='button_create_account2' style={{width: isSmallScreen ? '70%' : '', marginBottom: isSmallScreen ? '10px' : ''}} type="button" onClick={goToChangePassword}>
                                        Change password
                                    </button>
                                    <button onClick={handleSave} className='button_create_account2' style={{width: isSmallScreen ? '70%' : '', marginBottom: isSmallScreen ? '10px' : ''}}>
                                        Save
                                    </button>
                                    <button className='button_create_account2' style={{width: isSmallScreen ? '70%' : ''}} type="button" onClick={handleChangeModify}>
                                        Cancel
                                    </button>
                                </>
                    )}
                    </MDBCardBody>
                  </MDBCard>      
                  
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
                </div>
            </>
            )}
        </div>
    );
}
