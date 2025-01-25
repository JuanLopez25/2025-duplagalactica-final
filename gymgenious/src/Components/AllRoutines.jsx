import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import Loader from '../real_components/loader.jsx';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import CustomTable from '../real_components/Table4columns.jsx'
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';

function AllRoutines() {
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail,setUserMail] = useState(null)
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const [viewExercises, setViewExercises] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const isSmallScreen250 = useMediaQuery('(max-width:360px)');

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setRoutines(totalRoutines);
  };

  const handleViewExercises = () => {
    setViewExercises(!viewExercises);
  };

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const routines = await response.json();
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response2.ok) {
            throw new Error('Error al obtener las rutinas asignadas: ' + response2.statusText);
        }
        const assignedRoutines = await response2.json();
        const response3 = await fetch('https://two025-duplagalactica-final.onrender.com/get_excersices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response3.ok) {
            throw new Error('Error al obtener los ejercicios: ' + response3.statusText);
        }
        const exercisesData = await response3.json();
        const response4 = await fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}` 
            }
        });
        if (!response4.ok) {
            throw new Error('Error al obtener los ejercicios de Train Mate: ' + response4.statusText);
        }
        const exercisesDataFromTrainMate = await response4.json();
        const routinesWithExercisesData = routines.map((routine) => {
            const updatedExercises = routine.excercises.map((exercise) => {
                let matchedExercise = exercisesData.find((ex) => ex.id === exercise.id);
                if (!matchedExercise && Array.isArray(exercisesDataFromTrainMate.exercises)) {
                    matchedExercise = exercisesDataFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
                }
                if (matchedExercise) {
                    return {
                        ...exercise,
                        name: matchedExercise.name,
                        description: matchedExercise.description,
                    };
                }

                return exercise; 
            });

            return {
                ...routine,
                excercises: updatedExercises,
            };
        });
        const routinesWithAssignedCount = routinesWithExercisesData.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
                return acc + (assigned.users ? assigned.users.length : 0);
            }, 0);

            return {
                ...routine,
                cant_asignados: totalAssignedUsers,
            };
        });
        const routinesWithAssignedCountAndExerciseLength = routinesWithAssignedCount.map((routine) => {
          return {
              ...routine,
              exercise_length: routine.excercises ? routine.excercises.length : 0,
          };
        })
        setRoutines(routinesWithAssignedCountAndExerciseLength);
        setTotalRoutines(routinesWithAssignedCountAndExerciseLength);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
  };

  useEffect(() => {
    if(filterRoutines!=''){
      const filteredRoutinesSearcher = totalRoutines.filter(item => 
        item.name.toLowerCase().startsWith(filterRoutines.toLowerCase())
      );
      setRoutines(filteredRoutinesSearcher);
    } else {
      setRoutines(totalRoutines);
    }
  }, [filterRoutines]);

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
      if (userMail) {
          fetchUser();
      }
  }, [userMail]);

  const fetchUser = async () => {
    console.log("fetched user")
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setType(data.type);
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
      if (userMail) { 
          fetchRoutines();
      }
  }, [userMail]);

  const handleSelectEvent = (event) => {
  setSelectedEvent(event);
  handleCloseSearch();
  };
  const handleCloseModal = () => {
      setSelectedEvent(null);
      setViewExercises(false);
  };

    return (
      <div className="App">
        {type!='coach' ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <NewLeftBar/>
            <div className='input-container' style={{marginLeft: isSmallScreen ? '60px' : '50px', width: isSmallScreen ? '50%' : '30%', position: 'absolute', top: '0.5%'}}>
                        <div className='input-small-container'>
                            {openSearch ? (
                                <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                style={{
                                position: 'absolute',
                                borderRadius: '10px',
                                padding: '0 10px',
                                transition: 'all 0.3s ease',
                                }}
                                id={filterRoutines}
                                onChange={(e) => setFilterRoutines(e.target.value)} 
                            />
                            ) : (
                            <Button onClick={handleOpenSearch}
                            style={{
                                backgroundColor: '#48CFCB',
                                position: 'absolute',
                                borderRadius: '50%',
                                width: '5vh',
                                height: '5vh',
                                minWidth: '0',
                                minHeight: '0',
                                padding: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            >
                            <SearchIcon sx={{ color: '#424242' }} />
                            </Button>
                            )}
                            </div>
            </div>
            {routines && (
              <CustomTable columnsToShow={['Name','Owner','Excercises','Likes','No routines']} data={routines} handleSelectEvent={handleSelectEvent} vals={['name','owner','exercise_length','likes']}/> 
            )}
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModal}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {selectedEvent.cant_asignados}</p>
                  <p><strong>Likes:</strong> {5}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Owner:</strong> {selectedEvent.owner}</p>
                  <button onClick={handleViewExercises} style={{width: isSmallScreen ? '70%' : '40%'}}>View exercises</button>
                  <button onClick={handleCloseModal} style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px', width: isSmallScreen ? '70%' : '40%'}}>Close</button>
                </div>
              </div>
            )}
            {viewExercises && (
                <div className="Modal" onClick={handleViewExercises}>
                    <div className="Modal-Content-view-exercises" onClick={(e) => e.stopPropagation()}>
                        <h2>Exercises from {selectedEvent.routine}</h2>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Exercise</TableCell>
                                            <TableCell>Series</TableCell>
                                            <TableCell>Reps</TableCell>
                                            <TableCell>Timing</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedEvent?.excercises?.map((exercise) => (
                                            <TableRow key={exercise.id}>
                                                <TableCell>{exercise.name}</TableCell>
                                                <TableCell>{exercise.series} x</TableCell>
                                                <TableCell>{exercise.reps.join(', ')}</TableCell>
                                                <TableCell>{exercise.timing}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <button onClick={handleViewExercises} style={{marginTop:'10px'}}>Close</button>
                    </div>
                </div>
            )}
            {openCircularProgress ? (
              <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openCircularProgress}
              >
                <Loader></Loader>
              </Backdrop>
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
          </>
        )}
      </div>
    );
}

export default AllRoutines;
