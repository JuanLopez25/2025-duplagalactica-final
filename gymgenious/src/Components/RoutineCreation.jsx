import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import { useMediaQuery } from '@mui/material';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Loader from '../real_components/loader.jsx';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

export default function RoutineCreation() {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [userMail,setUserMail] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [routineExercises, setRoutineExercises] = useState([]);
    const navigate = useNavigate();
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failure, setFailure] = useState(false);
    const [errors, setErrors] = useState([]);
    const [failureErrors, setFailureErrors] = useState(false);
    const [warningFetchingExercises, setWarningFetchingExercises] = useState(false);
    const [openAdvise, setOpenAdvise] = useState(false);
    const [openAddExercise, setOpenAddExercise] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    const [series, setSeries] = useState(4);
    const [reps, setReps] = useState(Array(series).fill(''));
    const [timing, setTiming] = useState(0);
    const [errorAddExercise, setErrorAddExercise] = useState(false);

    const [openSearch, setOpenSearch] = useState(false);
    const [filterExercises, setFilterExercises] = useState('');
    const [totalExercises, setTotalExercises] = useState([]);
  
    const handleOpenSearch = () => {
      setOpenSearch(true);
    };
  
    const handleCloseSearch = () => {
      setOpenSearch(false);
      setExercises(totalExercises);
    };

    const handleSeriesChange = (e) => {
      const newSeries = parseInt(e.target.value.slice(-1)) || ''; 
      if (newSeries >= 1 && newSeries <= 8) {
          setSeries(newSeries);
          setReps(Array(newSeries).fill(''));
      }
  };
  
  

    const handleRepsChange = (index, value) => {
      const newReps = [...reps];
      newReps[index] = value;
      setReps(newReps);
    };

    const validateExerciseData = () => {
      let res=false;
      console.log(reps)
      if(reps.some(item => item === '')) {
        setErrorAddExercise(true);
      } else {
        res=true;
        setErrorAddExercise(false);
      }
      return res
    }

    const handleAddExercise = (exercise) => {
      if(validateExerciseData()){
        let exerciseWithParams = {
          id: exercise.id,
          owner: exercise.owner,
          reps: reps,
          series: series,
          timing: timing,
        }
        setRoutineExercises([...routineExercises, exerciseWithParams]);
        handleCloseModal();
      }
    };

    const handleDeleteExercise = (exercise) => {
      const updatedExercises = routineExercises.filter(stateExercise => stateExercise.id !== exercise.id);
      setRoutineExercises(updatedExercises);
      handleCloseModal();
    }
  
    const handleCloseModal = () => {
      setSelectedExercise(null);
      setOpenAdvise(false);
      setOpenAddExercise(false);
    };

    const handleSelectExercise = (exercise) => {
      handleCloseSearch();
      setSelectedExercise(exercise);
      if(routineExercises?.some(stateExercise => stateExercise.id === exercise.id)){
        setOpenAdvise(true);
      } else {
        setOpenAddExercise(true);
        setSeries(4);
        setReps(Array(4).fill(''));
        setTiming(0);
        setErrorAddExercise(false);
      }
    };

    const customList = (items) => (
      <div className='transfer-list'>
        <List dense component="div" role="list" sx={{maxHeight: '200px'}}>
          {items.map((exercise) => {
            const labelId = `transfer-list-item-${exercise.name}-label`;
            return (
              <>
              { (routineExercises?.some(stateExercise => stateExercise.id === exercise.id)) ? (
                <ListItemButton
                sx={{backgroundColor:'#091057'}}
                key={exercise.id}
                role="listitem"
                onClick={() => handleSelectExercise(exercise)}
              >
                {isSmallScreen ? (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px', color: 'white' }}>{exercise.name}</p></ListItemText>
                ) : (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%', color: 'white' }}>{exercise.name}</p></ListItemText>
                )}
                
                <DeleteIcon sx={{color:'white'}}/>
              </ListItemButton>
              ) : (
                <ListItemButton
                key={exercise.id}
                role="listitem"
                onClick={() => handleSelectExercise(exercise)}
              >
                {isSmallScreen ? (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{exercise.name}</p></ListItemText>
                ) : (
                  <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{exercise.name}</p></ListItemText>
                )}
                
                <AddCircleOutlineSharpIcon/>
              </ListItemButton>
              )}
              </>
            );
          })}
        </List>
      </div>
    );
      const fetchExercises = async () => {
      setOpenCircularProgress(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_excersices`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios: ' + response.statusText);
      }
      const exercisesData = await response.json();
  
        const response2 = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${authToken}`
          }
        });
        const exercisesDataFromTrainMate = await response2.json();
        const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises)
        setExercises(totalExercises);
        setTotalExercises(totalExercises);
        setOpenCircularProgress(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setOpenCircularProgress(false);
        setWarningFetchingExercises(true);
        setTimeout(() => {
          setWarningFetchingExercises(false);
        }, 3000);
      }
    };

    useEffect(() => {
      if(filterExercises!=''){
        const filteredExercisesSearcher = totalExercises.filter(item => 
          item.name.toLowerCase().startsWith(filterExercises.toLowerCase())
        );
        setExercises(filteredExercisesSearcher);
      } else {
          setExercises(totalExercises);
      }
  
    }, [filterExercises]);

    const validateForm = () => {
      let errors = [];
      
      if (name === '') {
          errors.push('Please assign a name to the routine.');
      }

      if (desc === '') {
        errors.push('Please assign a description to the routine.');
      }
      
      if (exercises === '') {
        errors.push('Please select at least one exercise to assign the routine.');
      }

      setErrors(errors);
      return errors.length===0;
  }

  const handleCreateRoutine = async () => {
    setOpenCircularProgress(true);
    if(validateForm()){
      try {  
        const newRoutine = {
          name: name,
          description: desc,
          excercises: routineExercises,
          owner: userMail,
        };
        
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/create_routine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(newRoutine),
        });
  
        if (!response.ok) {
          throw new Error('Error al crear la rutina');
        }
        setOpenCircularProgress(false);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            window.location.reload();
        }, 3000);
      } catch (error) {
        console.error("Error al crear la rutina:", error);
        setOpenCircularProgress(false);
        setFailure(true);
        setTimeout(() => {
            setFailure(false);
            window.location.reload()
        }, 3000);
      };
    } else {
        setOpenCircularProgress(false);
        setFailureErrors(true);
        setTimeout(() => {
            setFailureErrors(false);
            }, 3000);
      }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateRoutine();
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
      fetchExercises();
    }
  }, [userMail]);

  const verifyToken = async (token) => {
      try {
          const decodedToken = jwtDecode(token);
          setUserMail(decodedToken.email);
      } catch (error) {
          console.error('Error al verificar el token:', error);
          throw error;
      }
  };

  return (
    <div className='routine-creation-container'>
      <button 
        onClick={() => window.location.reload()} 
        className="custom-button-go-back-managing"
      >
        <KeyboardBackspaceIcon sx={{ color: '#F5F5F5' }} />
      </button>
      <div className='routine-creation-content'>
        <h2 style={{color:'#424242'}}>Create routine</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-create-routine-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
              <label htmlFor="name" style={{color:'#424242'}}>Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>
          <div className="input-create-routine-container" style={{display:'flex', justifyContent: 'space-between'}}>
          <div className="input-small-container">
                  <label htmlFor="desc" style={{color:'#424242'}}>Desc:</label>
                  {/* <input 
                  type="text" 
                  id="desc" 
                  name="desc" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  /> */}
                  <textarea 
                  onChange={(e) => setDesc(e.target.value)}
                  name="desc"
                  id="desc"
                  rows={4}
                  value={desc}
                  maxLength={300}
                  style={{maxHeight: '100px', width: '100%', borderRadius: '8px'}} />
              </div>
          </div>
          <div className="'grid-transfer-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
                <div style={{flexDirection: 'column', display: 'flex'}}>
                <label htmlFor="users" style={{ color: '#424242' }}>Exercises:</label>
                {openSearch ? (
                                <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                style={{
                                borderRadius: '10px',
                                transition: 'all 0.3s ease',
                                marginBottom: isSmallScreen ? '3%' : '1%',
                                width: isSmallScreen ? '60%' : '30%'
                                }}
                                id={filterExercises}
                                onChange={(e) => setFilterExercises(e.target.value)} 
                            />
                            ) : (
                            <Button onClick={handleOpenSearch}
                            style={{
                                backgroundColor: '#48CFCB',  
                                marginBottom: isSmallScreen ? '3%' : '1%',
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
                {exercises.length!=0 ? (
                  <Grid className='grid-transfer-content' item>{customList(exercises)}</Grid>
                ) : (
                  <div className='grid-transfer-content'>
                    There are not exercises
                  </div>
                )}
                
            </div>
          </div>
          <button type="submit" className='button_login'>
            Create routine
          </button>
        </form>
      </div>
      {selectedExercise && openAddExercise && (
        <div className="Modal" onClick={handleCloseModal}>
          <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{marginBottom: '0px'}}>Exercise</h2>
                                <p style={{
                                    marginTop: '5px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {selectedExercise.name}
                                </p>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                <div className="input-small-container">
                    <label htmlFor="desc" style={{color:'#424242'}}>Series:</label>
                    <input 
                      type="number" 
                      id="series" 
                      name="series" 
                      value={series}
                      max="8"
                      min="1"
                      onInput={(e) => e.target.value = e.target.value.replace(/^0+/, '')} // Elimina ceros iniciales
                      onChange={handleSeriesChange}
/>
                </div>
                <div className="input-small-container">
                    <label htmlFor="timing" style={{color:'#424242'}}>Timing:</label>
                    <input 
                    type="number" 
                    id="timing" 
                    name="timing" 
                    value={timing}
                    min="1"
                    max="500"
                    step='1'
                    onChange={(e) => setTiming(e.target.value)}
                    />
                </div>
            </div>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container" style={{ flex: 1, marginRight: '10px' }}>
                  <label htmlFor='reps' style={{ color: '#424242' }}>Reps:</label>
                  {reps.map((rep, index) => (
                    <input
                      type="text"
                      id={`reps-${index}`}
                      name={`reps-${index}`}
                      value={rep}
                      onChange={(e) => handleRepsChange(index, e.target.value)}
                      style={{ width: `${100 / series}%` }}
                    />
                ))}
                {errorAddExercise && (<p style={{color: 'red', margin: '0px'}}>Complete all fields</p>)}
              </div>
            </div>
            <button onClick={() => handleAddExercise(selectedExercise)} style={{width: isSmallScreen ? '70%' : '30%'}}>Add exercise</button>
            <button onClick={handleCloseModal} style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px', width: isSmallScreen ? '70%' : '30%'}}>Close</button>
          </div>
        </div>
      )}
      { openAdvise && selectedExercise && (
            <div className='alert-container' onClick={handleCloseModal}>
              <div className='alert-content' onClick={(e) => e.stopPropagation()}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Slide direction="up" in={openAdvise} mountOnEnter unmountOnExit>
                  <Alert 
                    style={{ 
                      fontSize: '100%', 
                      fontWeight: 'bold', 
                      alignItems: 'center', 
                    }} 
                    severity="info"
                  >
                    Are you sure you want to delete the exercise?
                    <div style={{ justifyContent: 'center', marginTop: '10px' }}>
                      <button 
                        onClick={() => handleDeleteExercise(selectedExercise)} 
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: '#229799',
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete exercise
                      </button>
                      <button 
                        onClick={handleCloseModal} 
                        style={{ 
                          marginLeft: '10px',
                          padding: '8px 16px', 
                          backgroundColor: '#229799',
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </Alert>
                </Slide>
              </Box>
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
        ) : null}
        { success ? (
            <div className='alert-container'>
              <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                          Routine successfully created!
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
                        Error creating routine.
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
                        <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                            Error creating routine. Try again!
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
