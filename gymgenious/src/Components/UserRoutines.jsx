import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import verifyToken from '../fetchs/verifyToken.jsx';
import NewLeftBar from '../real_components/NewLeftBar';
import ColorToggleButton from '../real_components/ColorToggleButton.jsx';
import Backdrop from '@mui/material/Backdrop';
import DaySelection from '../real_components/DaySelection.jsx';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';

export default function StickyHeadTable() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [userMail, setUserMail] = useState('');
    const [routines, setRoutines] = useState([]);
    const [routine, setRoutine] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewExercises, setViewExercises] = useState(false);
    const [warningConnection, setWarningConnection] = useState(false);
    const [rows, setRows] = useState([]);
    const [errorToken, setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const navigate = useNavigate();
    const [type, setType] = useState(null);
    const [warningFetchingUserRoutines, setWarningFetchingUserRoutines] = useState(false);
    const isMobileScreen = useMediaQuery('(min-height:750px)');
    const [maxHeight, setMaxHeight] = useState('600px');

     useEffect(() => {
        if (type!='client' && type!=null) {
            navigate('/');      
        }
    }, [type]);

    const fetchUser = async () => {
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
        if(data.type!='client'){
            navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        setOpenCircularProgress(false)
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
            localStorage.removeItem('authToken');
            navigate('/')
        }, 3000);
    }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        fetchRoutineWithExercises(event.routine);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
        setViewExercises(false);
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
            const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_assigned_routines', {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener las rutinas: ' + response.statusText);
            }
            const data = await response.json();
            const filteredRows = data.filter((row) =>
                row.users.some((u) => u === userMail)
            );
            
            const routinesData = await fetch('https://two025-duplagalactica-final.onrender.com/get_routines', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!routinesData.ok) {
                throw new Error('Error fetching routines: ' + routinesData.statusText);
            }
            const routines = await routinesData.json();
            const combinedData = filteredRows.map(assignedRoutine => {
                const routine = routines.find(routine => routine.id === assignedRoutine.id);
                if (routine) {
                    return {
                        ...assignedRoutine,
                        routine: routine.name
                    };
                }
            });
            setRows(combinedData);
            setOpenCircularProgress(false);
        } catch (error) {
            setOpenCircularProgress(false);
            console.error("Error fetching classes:", error);
            setWarningFetchingUserRoutines(true);
            setTimeout(() => {
                setWarningFetchingUserRoutines(false);
            }, 3000);
        }
    };

    const fetchRoutineWithExercises = async (routineName) => {
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
            const filteredRows = routines.filter((row) => row.name === routineName);
            const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_excersices', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response2.ok) {
                throw new Error('Error al obtener los ejercicios locales: ' + response2.statusText);
            }
            const exercisesData = await response2.json();
            const response3 = await fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}` 
                }
            });
            if (!response3.ok) {
                throw new Error('Error al obtener los ejercicios de Train Mate: ' + response3.statusText);
            }
            const exercisesDataFromTrainMate = await response3.json();
            console.log("Ejercicios de Train Mate:", exercisesDataFromTrainMate);
            const updatedExercises = filteredRows[0].excercises.map((exercise) => {
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
    
            const routineWithUpdatedExercises = {
                ...filteredRows[0],
                excercises: updatedExercises
            };
    
            setRoutine(routineWithUpdatedExercises);
            setOpenCircularProgress(false);
        } catch (error) {
            setOpenCircularProgress(false);
            console.error("Error fetching exercises:", error);
            setWarningFetchingUserRoutines(true);
            setTimeout(() => {
                setWarningFetchingUserRoutines(false);
            }, 3000);
        }
    };
    
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
        } else {
            navigate('/');
            console.error('No token found');
            return;
        }
      }, []);

    useEffect(() => {
        if (userMail) {
            fetchUser();
        }
    }, [userMail]);

    useEffect(() => {
    if(type==='client'){
        fetchRoutines();
    }
    }, [type])


    useEffect(() => {
        if (selectedDay) {
            const filteredRows = rows.filter((row) => row.day === selectedDay);
            setRoutines(filteredRows);
        } else {
            setRoutines(rows);
        }
    }, [rows, selectedDay]);

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
          <>
            <NewLeftBar />
            <div className="Table-Container">
                {!isSmallScreen ? (
                    <ColorToggleButton selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
                ) : (
                    <DaySelection selectedDay={selectedDay} setSelectedDay={setSelectedDay}/>
                )}
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
                                size={'medium'}
                            >
                                <TableHead>
                                    <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                        <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                            <TableSortLabel
                                                active={orderBy === 'name'}
                                                direction={orderBy === 'name' ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, 'name')}
                                            >
                                                Name
                                                {orderBy === 'name' ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                            <TableSortLabel
                                                active={orderBy === 'day'}
                                                direction={orderBy === 'day' ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, 'day')}
                                            >
                                                Day
                                                {orderBy === 'day' ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                        {!isSmallScreen && (
                                            <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                            <TableSortLabel
                                                active={orderBy === 'owner'}
                                                direction={orderBy === 'owner' ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, 'owner')}
                                            >
                                                Owner
                                                {orderBy === 'owner' ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.length===0 ? (
                                        <TableRow>
                                        <TableCell colSpan={isSmallScreen ? 2 : 3} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                            There are no assigned routines
                                        </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleRows.map((row) => (
                                        <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={`${row.id}-${row.day}`} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                            {row.routine}
                                            </TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>
                                            {row.day}
                                            </TableCell>
                                            {!isSmallScreen && (
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                                {row.owner}
                                            </TableCell>
                                            )}
                                        </TableRow>
                                        ))
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
                <div className="Modal" onClick={handleCloseModal}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <h2>Routine details</h2>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {routine.name}</p>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {routine.description}</p>
                        <p><strong>Day:</strong> {selectedEvent.day}</p>
                        <p><strong>Exercises:</strong> {routine.excercises ? routine.excercises.length : 0}</p>
                        <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Owner:</strong> {routine.owner}</p>
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
                                        {routine?.excercises?.map((exercise) => (
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
            {openCircularProgress && (
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
                    <Loader></Loader>
                </Backdrop>
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
            { warningFetchingUserRoutines ? (
                    <div className='alert-container'>
                        <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Slide direction="up" in={warningFetchingUserRoutines} mountOnEnter unmountOnExit >
                                <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                                    Connection error. Try again later!
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
