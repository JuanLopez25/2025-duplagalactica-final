import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Loader from '../real_components/loader.jsx';
import Searcher from '../real_components/searcher.jsx'
import verifyToken from '../fetchs/verifyToken.jsx'
import fetchRoutines from '../fetchs/fetchAllRoutines.jsx';
import CustomTable from '../real_components/Table4columns.jsx';

function BarAnimation({ routines, isSmallScreen }) {
    const [itemNb, setItemNb] = React.useState(5);

    const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);
  
    const routineNames = orderedRoutines?.map(routine => routine.name);
    const routineData = orderedRoutines?.map(routine => routine.cant_asignados);
  
    const handleItemNbChange = (event, newValue) => {
      if (typeof newValue !== 'number') {
        return;
      }
      setItemNb(newValue);
    };
    
    const routinesData = routines?.map(routine => ({
      label: routine.name,
      value: routine.cant_asignados, 
    }));

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%',backgroundColor:'#F5F5F5',marginTop:'10px',borderRadius:'10px',marginLeft:'2px' }}>
          <BarChart
            height={250}
            series={[{
              data: routineData.slice(0, itemNb),
              valueFormatter: (item) => `${item} users`,
            }]}
            xAxis={[{
              scaleType: 'band',
              data: routineNames.slice(0, itemNb),
            }]}   
          />
          {!isSmallScreen && (
          <PieChart
            height={250}
             legend= {{ hidden: true }}
                series={[{
                  data: routinesData.slice(0,itemNb),
                  innerRadius: 50,
                  // arcLabel:(params) => params.label ?? '',
                  // arcLabelMinAngle: 20,
                  valueFormatter: (item) => `${item.value} users`,              
                }]}
          />
        )}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 220, textAlign: 'center', marginRight: '1%' }}>
            <Typography id="input-item-number" gutterBottom>
              Routines number
            </Typography>
            <Slider
              value={itemNb}
              orientation="vertical"
              onChange={handleItemNbChange}
              valueLabelDisplay="auto"
              min={1}
              max={5}
              sx={{ height: '100%' }}
              aria-labelledby="input-item-number"
            />
        </Box>
      </Box>
    );
}

function TopRoutines() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [routines, setRoutines] = useState([]);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const navigate = useNavigate();
  const [viewExercises, setViewExercises] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setRoutines(totalRoutines);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleCloseSearch();
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setViewExercises(false);
  };

  const handleViewExercises = () => {
    setViewExercises(!viewExercises);
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
      if (userMail) {
          fetchRoutines(setOpenCircularProgress,setTotalRoutines,setRoutines,setWarningConnection);
      }
  }, [userMail]);


    return (
      <div className="App">
        {!userMail ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <>
            <NewLeftBar/>
            <Searcher filteredValues={filterRoutines} setFilterValues={setFilterRoutines} isSmallScreen={isSmallScreen} searchingParameter={'routine name'}/>
            <div>
              {routines && (
                          <CustomTable columnsToShow={['Name','Owner','Exercises','Users','There are no created routines']} data={routines} handleSelectEvent={handleSelectEvent} vals={['name','owner','exercises_length','cant_asignados']}/> 
              )}
              <div className='graphic-container'>
                <BarAnimation routines={routines} isSmallScreen={isSmallScreen}/>
              </div>
            </div>
            {selectedEvent && (
              <div className="Modal" onClick={handleCloseModal}>
                <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                  <h2>Routine details</h2>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Name:</strong> {selectedEvent.name}</p>
                  <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Exercises:</strong> {selectedEvent.excercises.length}</p>
                  <p><strong>Users:</strong> {selectedEvent.cant_asignados}</p>
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

export default TopRoutines;
