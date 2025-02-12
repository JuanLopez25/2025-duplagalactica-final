
import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import verifyToken from '../fetchs/verifyToken.jsx';
import fetchUser from '../fetchs/fetchUser.jsx';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import Loader from '../real_components/loader.jsx';
import CustomTable from '../real_components/Table3columns.jsx';
import fetchRoutines from '../fetchs/fetchAllRoutines.jsx';
import Searcher from '../real_components/searcher.jsx';

function CoachRoutines() {
  const [id,setId] = useState()
  const [allRoutines,setAllRoutines] = useState([])
  const [desc, setDesc] = useState('');
  const [exercises, setExercises] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [fetchName,setNameFetch] = useState('');
  const [descFetch,setDescFetch]= useState('');
  const [errorTiming,setErrorTiming] = useState(false)
  const [errorNumRepes,setErrorNumbRepes] = useState(false)
  const [exersFetch,setExersFetch]= useState([]);
  const [routineFetch,setRoutine] = useState({});
  const [name, setName] = useState('');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [routineExercises, setRoutineExercises] = useState([]);
  const navigate = useNavigate();
  const [openAdvise, setOpenAdvise] = useState(false);
  const [openAddExercise, setOpenAddExercise] = useState(false);
  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(Array(series).fill(''));
  const [errorExer,setErrorExers] = useState(false)
  const [timing, setTiming] = useState(0);
  const [errorAddExercise, setErrorAddExercise] = useState(false);
  const [errorEditRoutine, setErrorEditRoutine] = useState(false);
  const [filterRoutines, setFilterRoutines] = useState('');
  const [filterExercises, setFilterExercises] = useState('');
  const [totalExercises, setTotalExercises] = useState([]);
  const [totalRoutines, setTotalRoutines] = useState([]);

  useEffect(() => {
    if (type!='coach' && type!=null) {
      navigate('/');      
    }
  }, [type]);
  
  const handleCloseSearch = () => {
    setRoutines(totalRoutines);
  };


  const handleCloseSearchExercises = () => {
    setExercises(totalExercises);
  };

  const handleSeriesChange = (e) => {
    const newSeries = parseInt(e.target.value);
    if(newSeries>=0 && newSeries<=8) {
      setSeries(newSeries);
      setReps(Array(newSeries).fill(''));
    }
  };

  const handleRepsChange = (index, value) => {
    const newReps = [...reps];
    newReps[index] = value;
    setReps(newReps);
  };


  const validateForm = () => {
    let res = true
    
    if (routineExercises.length==0) {
      setErrorExers(true)
      res = false
    } else {
      setErrorExers(false)
    }

    return res;
  }

  const validateExerciseData = () => {
    let res = true;
    if (!Array.isArray(reps)) {
      console.error("Error: reps no es un array válido", reps);
      return;
    }
    const parsedReps = reps.map((item) => Number(item));
    if (reps.some((item) => item === null || item === "")) {
      res=false
      setErrorAddExercise(true);
      setErrorNumbRepes(false);
    } 
    else if (parsedReps.some((item) => isNaN(item))) {
      res=false
      setErrorNumbRepes(true);
      setErrorAddExercise(false);
    }
    else {
      setErrorAddExercise(false);
      setErrorNumbRepes(false);
    }
    if (timing==0) {
      res=false
      setErrorTiming(true)
    } else {
      setErrorTiming(false)
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
    handleCloseSearchExercises();
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

  const handleCloseModalEvent = () => {
    setSelectedEvent(null);
  };

  const handleCloseEditRoutine = () => {
    handleCloseSearchExercises();
    setErrorEditRoutine(false);
    setEditClass(false);
    setName('');
    setDesc('');
  };

  const customList = (items) => (
    <div className='transfer-list'>
      <List dense component="div" role="list" sx={{maxHeight: '220px'}}>
        {items.map((exercise) => {
          const labelId = `transfer-list-item-${exercise.name}-label`;
          return (
            <>
            { (routineExercises?.some(stateExercise => stateExercise?.id === exercise.id)) ? (
              <ListItemButton
              sx={{backgroundColor:'#091057'}}
              key={exercise.id}
              role="listitem"
              onClick={() => handleSelectExercise(exercise)}
            >
              {isSmallScreen ? (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px', color: 'white' }}>{exercise.name}</p></ListItemText>
              ) : (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%', color: 'white' }}>{exercise.name}</p></ListItemText>
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
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{exercise.name}</p></ListItemText>
              ) : (
                <ListItemText id={labelId}><p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' }}>{exercise.name}</p></ListItemText>
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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleCloseSearch();
  };

  const handleSaveEditRoutine = async () => {
    setOpenCircularProgress(true)
    if (validateForm()){
      try {
          const updatedRoutines = {
              ...routineFetch,
              rid: id,
              description: desc || descFetch,
              excers: routineExercises || exersFetch,
              name: name || fetchName,
          };
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
          }
          const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_routine_info', {
              method: 'PUT', 
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify({ newRoutine: updatedRoutines })
          });
          if (!response.ok) {
              throw new Error('Error al actualizar la rutina: ' + response.statusText);
          }
          setTimeout(() => {
              setOpenCircularProgress(false);
            }, 2000);
          
        } catch (error) {
          console.error("Error actualizarndo la rutina:", error);
          setOpenCircularProgress(false);
          setWarningConnection(true);
          setTimeout(() => {
            setWarningConnection(false);
          }, 3000);
          setEditClass(!editClass);
        } finally {
          window.location.reload()
        }
    } else {
      setOpenCircularProgress(false)
    }
  }

  const validateEditRoutine = () => {
    let res=true;
    if(name==='' && desc==='' && routineExercises.length===exersFetch.length){
      if(routineExercises.every((elemento, indice) => elemento === exersFetch[indice])) {
        res=false;
        setErrorEditRoutine(true);
      } else {
        setErrorEditRoutine(false);
      }
    } else {
      setErrorEditRoutine(false)
    }
    return res
  }

  const saveRoutine = async (event) => {
    if(validateEditRoutine()){
      event.preventDefault(); 
      handleSaveEditRoutine();
    }
  }

  const handleEditRoutine = (event) => {
    fetchExercises();
    setEditClass(!editClass);
    setRoutineExercises(event.excercises);
    setId(event.id)
    setNameFetch(event.name);
    setDescFetch(event.description);
    setExersFetch(event.excercises);
    setRoutine(event);
    setName('');
    setDesc('');
  } 

  const handeDeleteRoutine = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/delete_routine', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({event: event})
      });
      if (!response.ok) {
        throw new Error('Error al eliminar la rutina: ' + response.statusText);
      }
      await fetchRoutines(setOpenCircularProgress,setAllRoutines,setAllRoutines,setWarningConnection);
      window.location.reload()
      setOpenCircularProgress(false);
      handleCloseModalEvent();
    } catch (error) {
      console.error("Error fetching rutinas:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  }

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
      const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises);
      console.log(totalExercises)
      setExercises(totalExercises);
      setTotalExercises(totalExercises);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
          setWarningConnection(false);
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


  useEffect(() => {
      const token = localStorage.getItem('authToken');
      setOpenCircularProgress(true)
      if (token) {
          verifyToken(token,()=>{},setUserMail,setErrorToken);
      } else {
          navigate('/');
          console.error('No token found');
      }
  }, []);
    
  useEffect(() => {
    setOpenCircularProgress(true)
    if (userMail) {
        fetchUser(setType,()=>{},userMail,navigate,setWarningConnection);
    }
  }, [userMail]);


  useEffect(() => {
    setOpenCircularProgress(true);
    if (userMail) {
        fetchRoutines(
            ()=>{}, 
            setAllRoutines,
            setAllRoutines,
            setWarningConnection
        );
    }
  }, [userMail]);

  useEffect(() => {
      setOpenCircularProgress(true);
      if (allRoutines.length > 0) {
          const filteredRoutines = allRoutines.filter(event =>
              event.owner.includes(userMail)
          );

          setRoutines(filteredRoutines);
          setTotalRoutines(filteredRoutines);

          setTimeout(() => {
              setOpenCircularProgress(false); 
          }, 1000); 
      } else {
        setTimeout (()=> {
          setOpenCircularProgress(false)
        },5000)
      }
  }, [allRoutines, userMail]);




    return (
      <div className="App">
          <>
            <NewLeftBar/>
            <Searcher filteredValues={filterRoutines} setFilterValues={setFilterRoutines} isSmallScreen={isSmallScreen} searchingParameter={'routine name'}/>
            {routines && (
              <CustomTable columnsToShow={['Name','Description','Exercises','There are no created routines']} data={routines} handleSelectEvent={handleSelectEvent} vals={['name','description','exercise_length']}/> 
            )}
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModalEvent}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {selectedEvent.cant_asignados}</p>
                      <button onClick={()=> handleEditRoutine(selectedEvent)} style={{width: '70%'}}>Edit routine</button>
                      <button onClick={()=> handeDeleteRoutine(selectedEvent)} style={{marginTop:'10px', width: '70%'}}>Delete routine</button>
                      <button onClick={handleCloseModalEvent} style={{marginTop:'10px', width: '70%'}}>Close</button>
                </div>
              </div>
            )}
            {editClass && (
              <div className="Modal-edit-routine" onClick={handleCloseModal}>
                <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginBottom: '0px'}}>
                      <div className="input-small-container">
                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                        <input
                        type="text" 
                        id="name" 
                        name="name" 
                        value={name}
                        placeholder={fetchName}
                        onChange={(e) => setName(e.target.value)}
                        />
                        
                      </div>
                    </div>
                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginBottom: '0px'}}>
                      <div className="input-small-container">
                        <label htmlFor="desc" style={{color:'#14213D'}}>Description:</label>
                        
                        <textarea 
                          onChange={(e) => setDesc(e.target.value)}
                          name="desc"
                          id="desc"
                          rows={4}
                          value={desc}
                          placeholder={descFetch}
                          maxLength={300}
                          style={{maxHeight: '100px', width: '100%', borderRadius: '8px'}} />
                      </div>
                    </div>
                    <div className="'grid-transfer-container" style={{display:'flex', justifyContent: 'space-between',  marginTop: '0px'}}>
                      <div className="input-small-container">
                          
                          <div style={{flexDirection: 'column', display: 'flex'}}>
                          <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                          <div className='input-container'>
                              <div className='input-small-container'>
                                <input
                                type="text"
                                placeholder={`Search by exercise name....`}
                                style={{
                                borderRadius: '10px',
                                left: '3%',
                                transition: 'all 0.3s ease',
                                }}
                                id={filterExercises}
                                onChange={(e) => setFilterExercises(e.target.value)} 
                                />
                              </div>
                          </div>
                </div>
                          {exercises.length!=0 ? (
                            <Grid className='grid-transfer-content' item>{customList(exercises)}</Grid>
                          ) : (
                            <div className='grid-transfer-content'>
                              There are not exercices
                            </div>
                          )}
                          {errorExer && (<p style={{color: 'red', margin: '0px'}}>There is no selected exercises</p>)}
                          {errorEditRoutine && (<p style={{color: 'red', margin: '0px'}}>No changes were done</p>)}
                      </div>
                      
                    </div>
                    <button onClick={saveRoutine} style={{ width: isSmallScreen ? '70%' : '30%'}} className='button-create-account2'>Save changes</button>
                    <button onClick={handleCloseEditRoutine} className='button-create-account2' style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px',width: isSmallScreen ? '70%' : '30%'}}>Cancel</button>

                </div>
              </div>
            )}
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
                          <label htmlFor="desc" style={{color:'#14213D'}}>Series:</label>
                          <input 
                          type="number" 
                          id="series" 
                          name="series" 
                          value={series}
                          min="1"
                          step='1'
                          max="8"
                          onChange={handleSeriesChange}
                          />
                      </div>
                      <div className="input-small-container">
                          <label htmlFor="timing" style={{color:'#14213D'}}>Timing:</label>
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
                          {errorTiming && (<p style={{color: 'red', margin: '0px'}}>Timing must be grater than 0</p>)}
                      </div>
                  </div>
                  <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                    <div className="input-small-container" style={{ flex: 1, marginRight: '10px' }}>
                        <label htmlFor='reps' style={{ color: '#14213D' }}>Reps:</label>
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
                      {errorNumRepes && (<p style={{color: 'red', margin: '0px'}}>The fields must be numbers</p>)}
                    </div>
                  </div>
                  <button onClick={() => handleAddExercise(selectedExercise)}>Add exercise</button>
                  <button onClick={handleCloseModal} style={{marginLeft:'10px'}}>Close</button>
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

export default CoachRoutines;
