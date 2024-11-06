import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UsserAssignment from './UsersAssignment.jsx';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Loader from '../real_components/loader.jsx'

export default function RoutineCreation() {
    const [routineAssigned, setRoutine] = useState(''); 
    const [userMail,setUserMail] = useState(null);
    const [users, setUsers] = useState([]);
    const [routines, setRoutines] = useState([]);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
    const [errors, setErrors] = useState([]);
    const [failureErrors, setFailureErrors] = useState(false);
    const [fetchAttempt, setFetchAttempt] = useState(0);
    const [day, setDay] = useState('');
    const [usersChanged, setUsersChanged] = useState(false);
    const [errorDaySelected, setErrorDaySelected] = useState(false);
    const [errorRoutineSelected, setErrorRoutineSelected] = useState(false);


    const fetchRoutines = async () => {
        setOpenCircularProgress(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
            const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_routines`, {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            setRoutines(data);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error("Error fetching rutinas:", error);
            setOpenCircularProgress(false);
            setWarningFetchingRoutines(true);
            setTimeout(() => {
                setWarningFetchingRoutines(false);
            }, 3000);
        }
    };

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
          verifyToken(token);
      } else {
          console.error('No token found');
      }
    }, []);

    useEffect(() => {
        if (userMail) {
            fetchRoutines();
        }
      }, [userMail]);

    const verifyToken = async (token) => {
        setOpenCircularProgress(true);
        try {
            const decodedToken = jwtDecode(token);
            setUserMail(decodedToken.email);
            setOpenCircularProgress(false);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setOpenCircularProgress(false);
            throw error;
        }
    };

    const validateForm = () => {
        let errors = [];
        setErrorRoutineSelected(false)
        setErrorDaySelected(false)
        
        if (routineAssigned === '') {
            errors.push('Please select a routine to assign');
            setErrorRoutineSelected(true)
        }

        if (day === '') {
            errors.push('Please select one day to assign the routine.');
            setErrorDaySelected(true)
        }
        return errors.length===0;
    }

    const handleAssignRoutine = async () => {
        if(validateForm()){
            setOpenCircularProgress(true);
            try {
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                  console.error('Token no disponible en localStorage');
                  return;
                }
                const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_routines', {
                    method: 'GET', 
                    headers: {
                      'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response2.ok) {
                    throw new Error('Error al obtener las rutinas: ' + response2.statusText);
                }
                const data2 = await response2.json();
                const filteredRoutines = data2.filter(event => event.id==routineAssigned);
                const newAsignRoutine = {
                    id: routineAssigned,
                    user: users,
                    owner: filteredRoutines[0].owner,
                    assigner: userMail,
                    day: day,
                    routine: filteredRoutines[0].name
                };
                const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/assign_routine_to_user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(newAsignRoutine),
                });

                if (!response.ok) {
                    throw new Error('Error al asignar la rutina');
                }
                setOpenCircularProgress(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (error) {
                console.error("Error al asignar la rutina:", error);
                setOpenCircularProgress(false);
                setFailure(true);
                setTimeout(() => {
                    setFailure(false);
                }, 3000);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAssignRoutine();
    };

    const handleUsersChange = (newUsers) => {
        setUsersChanged(true);
        setUsers(newUsers);
    };

    return (
        <div className='assign-routine-container'>
            <button 
                onClick={() => window.location.reload()} 
                className="custom-button-go-back-managing"
            >
                <KeyboardBackspaceIcon sx={{ color: '#F5F5F5' }} />
            </button>
            <div className='assign-routine-content'>
                <h2 style={{ color: '#424242' }}>Assign users</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="input-small-container">
                            <label htmlFor="routineAssigned" style={{ color: '#424242' }}>Routine:</label>
                            <select
                                id="routineAssigned"
                                name="routineAssigned"
                                value={routineAssigned}
                                onChange={(e) => setRoutine(e.target.value)}
                                style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                            >
                                <option value="">Select</option>
                                {routines.map((routine) => (
                                    <option style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} key={routine.id} value={routine.id}>
                                        {routine.name.length > 50 ? `${routine.name.substring(0, 50)}...` : routine.name}
                                    </option>
                                ))}
                            </select>
                            {errorRoutineSelected && (<p style={{color: 'red', margin: '0px'}}>Select a routine</p>)}
                        </div>
                        <div className="input-small-container">
                            <label htmlFor="day" style={{color:'#424242'}}>Day:</label>
                            <select
                            id="day" 
                            name="day" 
                            value={day} 
                            onChange={(e) => setDay(e.target.value)} 
                            >
                                <option value="" >Select</option>
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                            </select>
                            {errorDaySelected && (<p style={{color: 'red', margin: '0px'}}>Select a day</p>)}
                        </div>
                    </div>
                    <div className="input-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0px' }}>
                        <div className="input-small-container">
                            <label htmlFor="users" style={{ color: '#424242' }}>Users:</label>
                            <UsserAssignment onUsersChange={handleUsersChange} routine={routineAssigned} routineDay={day}/>
                        </div>
                    </div>
                    {usersChanged ? (
                        <button type="submit" className='button_login' style={{marginTop: '0px'}}>
                            Assign users
                        </button>
                    ) : (
                        <div className='button_login' style={{marginTop: '0px'}}>
                            Assign users
                        </div>
                    )}
                    
                </form>
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
                            Routine successfully assigned!
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
                            Error assigning routine!
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
            { warningFetchingRoutines ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningFetchingRoutines} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error fetching routines. Try again!
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
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                Error assigning routine. Try again!
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
}



