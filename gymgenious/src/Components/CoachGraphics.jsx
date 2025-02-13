import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import fetchUser from '../fetchs/fetchUser.jsx'
import verifyToken from '../fetchs/verifyToken.jsx'
import { BarChart } from '@mui/x-charts/BarChart';
import Loader from '../real_components/loader.jsx';
import {MDBTypography} from 'mdb-react-ui-kit';

function TopRoutines({ routines, isSmallScreen }) {
    const [itemNb, setItemNb] = React.useState(5);
    const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);
    const routineNames = orderedRoutines?.map(routine => routine.name);
    const routineData = orderedRoutines?.map(routine => routine.cant_asignados);
  
    return (
      <>
        
        <Box sx={{
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'end',
            width: '97%',
            height: isSmallScreen ? '90%' : '70%',
            background: 'rgba(245, 245, 245, 0.7)',
            position: 'relative',
            top: '0', 
            borderRadius: '10px',
            marginBottom: isSmallScreen ? '5px' : '0',
          }}>
          <BarChart
            height={isSmallScreen ? 200 : 500}
            series={[{
              data: routineData.slice(0, itemNb),
            }]}
            xAxis={[{
              scaleType: 'band',
              data: routineNames.slice(0, itemNb),
              fill:'red'
            }]}
          />
          <MDBTypography tag='h3' style={{color: '#424242',fontWeight:'bold', position: 'absolute', top: '15px'}}>Top routines</MDBTypography>
      </Box>
    </>
    );
}

function TopClasses({classes, isSmallScreen}) {
    const orderedClasses = classes.sort((a, b) => b.BookedUsers.length - a.BookedUsers.length);
    const classesNames = orderedClasses?.map(clase => clase.name);
    const classesData = orderedClasses?.map(clase => clase.BookedUsers.length);
  
    return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'end',
          width: '97%',
          height: isSmallScreen ? '90%' : '70%',
          background: 'rgba(245, 245, 245, 0.7)',
          position: 'relative',
          top: '0', 
          borderRadius: '10px',
          marginBottom: isSmallScreen ? '5px' : '0',
        }}>
          <MDBTypography tag='h3' style={{color: '#424242', fontWeight:'bold', position: 'absolute', top: '15px' }}>Top classes</MDBTypography>
          <BarChart
            height={isSmallScreen ? 200 : 500}
            series={[{
              data: classesData.slice(0, 5),
            }]}
            xAxis={[{
              scaleType: 'band',
              data: classesNames.slice(0, 5),
            }]}
          />
      </Box>
    );
}

function ExercisesVsUsers({exersCoachUsers, isSmallScreen}) {
    const orderedClasses = exersCoachUsers.sort((a, b) => b.count - a.count);
    const classesNames = orderedClasses?.map(clase => clase.exercise);
    const classesData = orderedClasses?.map(clase => clase.count);
    console.log(orderedClasses)
  
    return (
      <Box sx={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'end',
          width: '97%',
          height: isSmallScreen ? '90%' : '70%',
          background: 'rgba(245, 245, 245, 0.7)',
          position: 'relative',
          top: '0', 
          borderRadius: '10px',
        }}>
        <MDBTypography tag='h3' style={{color: '#424242', fontWeight:'bold', position: 'absolute', top: '15px' }}>Top exercises</MDBTypography>
        <BarChart
          height={isSmallScreen ? 200 : 500}
          series={[{
            data: classesData.slice(0, 5),
          }]}
          xAxis={[{
            scaleType: 'band',
            data: classesNames.slice(0, 5),
          }]}
        />
    </Box>
  );
}

function CoachGraphics() {
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [classes, setClasses] = useState([]);
  const [exersCoachUsers,setExersCoachUsers] = useState([])

  useEffect(() => {
    if (type!='coach' && type!=null) {
      navigate('/');      
    }
  }, [type]);

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }

        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_routines`, {
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
        const routinesWithAssignedCount = routines.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
                return acc + (assigned.users ? assigned.users.length : 0); 
            }, 0);
            return {
                ...routine,
                cant_asignados: totalAssignedUsers, 
            };
        });

        setRoutines(routinesWithAssignedCount);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }

  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const fetchExcersicesCoachUsers = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las clases: ' + response.statusText);
        }
        const data = await response.json();

        const uniqueBookedUsers = new Set();
        data.forEach(routine => {
            routine.users.forEach(user => uniqueBookedUsers.add(user));
        });

        const bookedUsersArray = Array.from(uniqueBookedUsers);
        const userRoutinesMap = {};

        for (const user of bookedUsersArray) {
            userRoutinesMap[user] = [];
            data.forEach(routine => {
                if (routine.users.includes(user)) {
                    userRoutinesMap[user].push(routine.id);
                }
            });
        }
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response2.ok) {
            throw new Error('Error al obtener las rutinas: ' + response2.statusText);
        }
        const data2 = await response2.json();

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
        const exercisesDataFromTrainMate = await response4.json();
        const routinesWithExercisesData = data2.map((routine) => {
            const updatedExercises = routine.excercises.map((exercise) => {
                if (exercise.owner === "Train-Mate") {
                    const matchedExercise = exercisesDataFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
                    if (matchedExercise) {
                        return {
                            ...exercise,
                            name: matchedExercise.name,
                            description: matchedExercise.description,
                        };
                    }
                } else {
                    const matchedExercise = exercisesData.find((ex) => ex.id === exercise.id);
                    if (matchedExercise) {
                        return {
                            ...exercise,
                            name: matchedExercise.name,
                            description: matchedExercise.description,
                        };
                    }
                }
                return exercise; 
            });

            return {
                ...routine,
                excercises: updatedExercises, 
            };
        });
        
        const exerciseCountMap = {};

        for (const user of bookedUsersArray) {
            const exercisesSeen = new Set();
            userRoutinesMap[user].forEach(routineId => {
                const routine = routinesWithExercisesData.find(r => r.id === routineId);
                if (routine) {
                    routine.excercises.forEach(exercise => {
                        exercisesSeen.add(exercise.name);
                    });
                }
            });

            exercisesSeen.forEach(exercise => {
                exerciseCountMap[exercise] = (exerciseCountMap[exercise] || 0) + 1;
            });
        }

        const resultArray = Object.entries(exerciseCountMap).map(([exercise, count]) => ({ exercise, count }));
        console.log("resultado",resultArray)
        setExersCoachUsers(resultArray);
    } catch (error) {
        console.error("Error fetching classes:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
};

  
  useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
          verifyToken(token,()=>{},setUserMail,setErrorToken)
      } else {
          navigate('/');
          console.error('No token found');
      }
    }, []);
    
  useEffect(() => {
      if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection)
      }
  }, [userMail]);

  useEffect(() => {
      if (userMail && type) { 
          fetchRoutines();
          fetchClasses();
          fetchExcersicesCoachUsers();
          setTimeout(() => {
            setOpenCircularProgress(false);
          }, 5000)
      }
  }, [userMail,type]);
    

    return (
      <div className="App">
          <>
            <NewLeftBar/>
            <Box
            sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: '90%',
              width: '95%',
              marginLeft: isSmallScreen ? '4%' : '3%',
              marginTop: isSmallScreen ? '55px' : '4%',
            }}
          >
            <Box sx={{ flex: 1, width: '100%' }}>
              <TopRoutines routines={routines} isSmallScreen={isSmallScreen} />
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <TopClasses classes={classes} isSmallScreen={isSmallScreen} />
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <ExercisesVsUsers exersCoachUsers={exersCoachUsers} isSmallScreen={isSmallScreen} />
            </Box>
          </Box>
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
      </div>
    );
}

export default CoachGraphics;
