
import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import Loader from '../real_components/loader.jsx';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const day = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return daysOfWeek[date.getDay()];
};

function CoachRoutines() {
  const [order, setOrder] = useState('asc');
  const [id,setId] = useState()
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [desc, setDesc] = useState('');
  const [exercises, setExercises] = useState([]);
  const [day, setDay] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const isSmallScreen250 = useMediaQuery('(max-width:360px)');
  const [fetchName,setNameFetch] = useState('');
  const [descFetch,setDescFetch]= useState('');
  const [exersFetch,setExersFetch]= useState([]);
  const [routineFetch,setRoutine] = useState({});
  const [name, setName] = useState('');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [routineExercises, setRoutineExercises] = useState([]);
  const navigate = useNavigate();
  const [warningFetchingExercises, setWarningFetchingExercises] = useState(false);
  const [openAdvise, setOpenAdvise] = useState(false);
  const [openAddExercise, setOpenAddExercise] = useState(false);

  const [series, setSeries] = useState(4);
  const [reps, setReps] = useState(Array(series).fill(''));
  const [timing, setTiming] = useState(0);
  const [errorAddExercise, setErrorAddExercise] = useState(false);
  const [errorEditRoutine, setErrorEditRoutine] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setRoutines(totalRoutines);
  };

  const [openSearchExercises, setOpenSearchExercises] = useState(false);
  const [filterExercises, setFilterExercises] = useState('');
  const [totalExercises, setTotalExercises] = useState([]);

  const handleOpenSearchExercises = () => {
    setOpenSearchExercises(true);
  };

  const handleCloseSearchExercises = () => {
    setOpenSearchExercises(false);
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleCloseSearch();
  };


  const handleSaveEditRoutine = async () => {
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
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/update_routine_info', {
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
    }
    return res
  }

  const saveRoutine = async (event) => {
    if(validateEditRoutine()){
      event.preventDefault(); 
      handleSaveEditRoutine();
      setEditClass(!editClass);
      // setTimeout(() => {
      //   setOpenCircularProgress(false);
      // }, 7000);
      await fetchRoutines();
      window.location.reload()
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
    setDay('');
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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/delete_routine', {
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
      await fetchRoutines();
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

  const fetchRoutines = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_routines', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const routines = await response.json();
        const filteredRoutines = routines.filter(event => event.owner.includes(userMail));
        const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response2.ok) {
            throw new Error('Error al obtener las rutinas asignadas: ' + response2.statusText);
        }
        const assignedRoutines = await response2.json();
        const response3 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_excersices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response3.ok) {
            throw new Error('Error al obtener los ejercicios: ' + response3.statusText);
        }
        const exercisesData = await response3.json();
        console.log("Ejercicios locales:", exercisesData);
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
        const routinesWithExercisesData = filteredRoutines.map((routine) => {
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
        setRoutines(routinesWithAssignedCount);
        setTotalRoutines(routinesWithAssignedCount);
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

const fetchExercises = async () => {
  setOpenCircularProgress(true);
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Token no disponible en localStorage');
      return;
    }
    const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_excersices`, {
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

      useEffect(() => {
        if(isSmallScreen) {
          setRowsPerPage(10);
        } else {
          setRowsPerPage(5)
        }
        if(isMobileScreen) {
          setMaxHeight('700px');
        } else {
          setMaxHeight('600px')
        }
      }, [isSmallScreen, isMobileScreen])
    
      const fetchUser = async () => {
        setOpenCircularProgress(true);
        try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
          }
          const encodedUserMail = encodeURIComponent(userMail);
          const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
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

    const visibleRows = React.useMemo(
      () =>
        [...routines]
          .sort((a, b) =>
            order === 'asc'
              ? a[orderBy] < b[orderBy]
                ? -1
                : 1
              : a[orderBy] > b[orderBy]
              ? -1
              : 1
          )
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      [order, orderBy, page, rowsPerPage, routines]
    );

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
            <div className="Table-Container">
            <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#F5F5F5', border: '2px solid #424242', borderRadius: '10px' }}>
              <Paper
                  sx={{
                  width: '100%',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '10px'
                  }}
              >
                  <TableContainer sx={{maxHeight: {maxHeight}, overflow: 'auto'}}>
                      <Table
                          sx={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          }}
                          aria-labelledby="tableTitle"
                          size={dense ? 'small' : 'medium'}
                      >
                          <TableHead>
                              <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                  <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                            <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'name')}>
                              Name
                              {orderBy === 'name' ? (
                              <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                              ) : (
                                null
                              )}
                            </TableSortLabel>
                          </TableCell>
                          {!isSmallScreen250 && (
                            <TableCell align="right" sx={{borderBottom: '1px solid #424242',borderRight: '1px solid #424242', fontWeight: 'bold',color:'#424242' }}>
                              <TableSortLabel active={orderBy === 'excercises'} direction={orderBy === 'excercises' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'excercises')}>
                                Exercises
                                {orderBy === 'excercises' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                          {!isSmallScreen && (
                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', fontWeight: 'bold',color:'#424242' }}>
                              <TableSortLabel active={orderBy === 'description'} direction={orderBy === 'description' ? order : 'asc'} onClick={(event) => handleRequestSort(event, 'description')}>
                                Description
                                {orderBy === 'description' ? (
                                    <Box component="span" sx={visuallyHidden}>
                                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : (
                                  null
                                )}
                              </TableSortLabel>
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {visibleRows.length===0 ? (
                            <TableRow>
                            <TableCell colSpan={isSmallScreen ? 2 : 3} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                There are no created routines
                            </TableCell>
                            </TableRow>
                        ) : (
                          <>
                            {visibleRows.map((row) => (
                              <TableRow onClick={()=>handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                  {row.name}
                                </TableCell>
                                {!isSmallScreen250 && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242',color:'#424242' }}>
                                    {row.excercises.length}
                                  </TableCell>
                                )}
                                {!isSmallScreen && (
                                  <TableCell align="right" sx={{ borderBottom: '1px solid #424242',color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                    {row.description} 
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {visibleRows.length!=0 ? (
                    <>
                      {isSmallScreen ? (
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            component="div"
                            count={routines.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                        />
                        ) : (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={routines.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      )}
                    </>
                  ) : (
                    null
                  )}
                </Paper>
              </Box>
            </div>
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
                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                      <div className="input-small-container">
                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                        <input
                        type="text" 
                        id="name" 
                        name="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder={fetchName}
                        />
                      </div>
                    </div>
                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                      <div className="input-small-container">
                        <label htmlFor="desc" style={{color:'#14213D'}}>Description:</label>
                        {/* <input 
                        type="text" 
                        id="desc" 
                        name="desc"
                        value={desc} 
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder={descFetch}
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
                          <label htmlFor="users" style={{ color: '#14213D' }}>Exercises:</label>
                          {openSearchExercises ? (
                                <input
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                style={{
                                borderRadius: '10px',
                                transition: 'all 0.3s ease',
                                width: isSmallScreen ? '60%' : '30%',
                                marginBottom: isSmallScreen ? '3%' : '1%',
                                }}
                                id={filterExercises}
                                onChange={(e) => setFilterExercises(e.target.value)} 
                            />
                            ) : (
                            <Button onClick={handleOpenSearchExercises}
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
                              There are not exercices
                            </div>
                          )}
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
        )}
      </div>
    );
}

export default CoachRoutines;
