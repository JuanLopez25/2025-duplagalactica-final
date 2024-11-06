import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import Loader from '../real_components/loader.jsx'
import TextField from '@mui/material/TextField';
import { useMediaQuery } from '@mui/material';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [assigned_days,setAssignedDays] = useState(0)
    const [nameFetch, setNameFetch] = useState('');
    const [lastNameFetch, setLastNameFetch] = useState('');
    const [dateFetch, setDateFetch] = useState('');
    const [emailFetch, setEmailFetch] = useState('');
    const [amountOfExercs,setAmountOfExercs] = useState(0)
    const [createdExercises,setCreatedExercises] = useState([])
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true);
    const [user, setUser] = useState({});
    const [classes, setClasses] = useState([]);
    const [userMail, setUserMail] = useState('');
    const [errorToken,setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [warningFetchingUserInformation, setWarningFetchingUserInformation] = useState(false);
    const [warningModifyingData, setWarningModifyingData] = useState(false);
    const [errorForm, setErrorForm] = useState(false);
    const [assigned_routines,setAssignedRoutines] = useState([])
    const [matchedRoutines,setMatchedRoutines] = useState([])
    const [created_classes,setCreatedClasses]=useState([])
    const [amountOfOwners,setOwners] = useState(0)
    const [amountOfDays,setAmountOfDays] = useState(0)
    const [assignerRoutineAmount,setAssignerRoutineAmount] = useState([])
    const [permanentClasses, setPermanentClasses] = useState(0)
    const [permanentClassesCreated, setPermanentClassesCreated] = useState(0)
    const [type,setType] = useState('')
    const [createdClassesDays,setCreatedClassesDays] = useState(0);
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    
    const fetchUserInformation = async () => {
        setOpenCircularProgress(true);
        try {
            
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_users`, {
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
            setType(filteredRows[0].type)
            setNameFetch(filteredRows[0].Name);
            setLastNameFetch(filteredRows[0].Lastname);
            setEmailFetch(filteredRows[0].Mail);
            setDateFetch(filteredRows[0].Birthday);
            setUser(filteredRows[0]);
            const response2 = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (!response2.ok) {
                throw new Error('Error al obtener los datos del usuario: ' + response2.statusText);
            }
            const response5 = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_excersices`, {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response5.ok) {
                throw new Error('Error al obtener los ejercicios: ' + response.statusText);
            }
            const exercisesData = await response5.json();
            const filteredExercisesCreated = exercisesData.filter((row) => row.owner === userMail);
            setCreatedExercises(filteredExercisesCreated)
            const data2 = await response2.json();
            const filteredRows2 = data2.filter((row) =>
                row.users.some((u) => u === userMail)
            );
            const fileredAssignerRoutine = data2.filter((row)=>
                row.assigner == userMail
            )
            const uniqueAssignedDays = new Set();
            fileredAssignerRoutine.filter((assigned)=> {
                if (assigned.day) {
                    uniqueAssignedDays.add(assigned.day);
                }
                }
            )
            setAssignedDays(uniqueAssignedDays.size)
            setAssignerRoutineAmount(fileredAssignerRoutine)
            setAssignedRoutines(filteredRows2);
            const response3 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_routines', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (!response3.ok) {
                throw new Error('Error al obtener las rutinas: ' + response3.statusText);
            }
            const uniqueExerciseIds = new Set();
            const uniqueOwners = new Set();
            const uniqueClassDay = new Set();
            const uniqueCreatedClassesDay = new Set();
            const routines3 = await response3.json();
            const matchedRoutines = filteredRows2.map((assignedRoutine) => {
                const matchedRoutine = routines3.find((routine) => routine.id === assignedRoutine.id);
                return { matchedRoutine }; 
            });
            matchedRoutines.forEach(routine => {
                if (routine.matchedRoutine.excercises && Array.isArray(routine.matchedRoutine.excercises)) {
                    routine.matchedRoutine.excercises.forEach(exercise => {
                        uniqueExerciseIds.add(exercise.id);
                    });
                }
            });
            matchedRoutines.forEach(routine => {
                if (routine.matchedRoutine.owner) {
                    uniqueOwners.add(routine.matchedRoutine.owner);
                }
            });
            const response4 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes', {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response4.ok) {
            throw new Error('Error al obtener las clases: ' + response.statusText);
            }
            const data4 = await response4.json();
            const createdClasses = data4.filter(event=> event.owner ==userMail)
            const filteredClasses4 = data4.filter(event => event.BookedUsers.includes(userMail));
            filteredClasses4.forEach(classess => {
                if (classess.day) {
                    uniqueClassDay.add(classess.day);
                }
            });
            createdClasses.forEach(classess => {
                if (classess.day) {
                    uniqueCreatedClassesDay.add(classess.day);
                }
            });
            const recurrenClasses = filteredClasses4.filter(clase => clase.permanent==='Si');
            const recurrenClassesCreated = createdClasses.filter(clase => clase.permanent==='Si');
            setPermanentClassesCreated(recurrenClassesCreated)
            setCreatedClassesDays(uniqueCreatedClassesDay.size)
            setCreatedClasses(createdClasses)
            setPermanentClasses(recurrenClasses)
            setAmountOfDays(uniqueClassDay.size)
            setClasses(filteredClasses4);
            setOwners(uniqueOwners.size)
            setMatchedRoutines(matchedRoutines);
            setAmountOfExercs(uniqueExerciseIds.size)
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
            const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_users_info', {
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
    const verifyToken = async (token) => {
        setOpenCircularProgress(true);
        try {
            const decodedToken = jwtDecode(token);
            setUserMail(decodedToken.email);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setOpenCircularProgress(false);
            setErrorToken(true);
            setTimeout(() => {
              setErrorToken(false);
            }, 3000);
            throw error;
        }
      };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token);
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
            <MDBContainer className="py-5">
              <MDBRow>
                <MDBCol>
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
                                {errorForm && (<p style={{color: 'red', margin: '0px'}}>There are no changes</p>)}
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
                  {/* <MDBRow>
                    {type=='client'? (
                        <>
                        <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody>
                                <MDBCardText className="mb-4"><span style={{color:'#424242',fontWeight:'bold'}}>Routines</span></MDBCardText>
                                <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Assigned routines</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={assigned_routines.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}} />
                                </MDBProgress>
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Different exercises</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={amountOfExercs} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Coaches</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={amountOfOwners} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
                                </MDBCardBody>
                            </MDBCard>
                            </MDBCol>
                            <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody>
                                <MDBCardText className="mb-4"><span style={{color:'#424242',fontWeight:'bold'}}>Classes</span></MDBCardText>
                                <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Amount of classes</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={classes.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Booked days</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={amountOfDays} valuemin={0} valuemax={7} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Recurrent classes</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={permanentClasses.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        </>
                    ) : (
                        <>
                        <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody>
                                <MDBCardText className="mb-4"><span style={{color:'#424242',fontWeight:'bold'}}>Routines</span></MDBCardText>
                                <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Assigned routines</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={assignerRoutineAmount.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}} />
                                </MDBProgress>
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Created exercises</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={createdExercises.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Different assigned routines days</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={assigned_days} valuemin={0} valuemax={7} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
                                </MDBCardBody>
                            </MDBCard>
                            </MDBCol>
                            <MDBCol md="6">
                            <MDBCard className="mb-4 mb-md-0">
                                <MDBCardBody>
                                <MDBCardText className="mb-4"><span style={{color:'#424242',fontWeight:'bold'}}>Classes</span></MDBCardText>
                                <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Created classes</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={created_classes.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Differen created classes days</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={createdClassesDays} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
            
                                <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Recurrent classes created</MDBCardText>
                                <MDBProgress className="rounded">
                                    <MDBProgressBar width={permanentClassesCreated.length} valuemin={0} valuemax={100} style={{backgroundColor:'#48CFCB'}}/>
                                </MDBProgress>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        </>
                    )
                    }
                  </MDBRow> */}
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
