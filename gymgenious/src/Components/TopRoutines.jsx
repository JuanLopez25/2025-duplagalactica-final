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
import CloseIcon from '@mui/icons-material/Close';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Slide from '@mui/material/Slide';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import Loader from '../real_components/loader.jsx';
import Searcher from '../real_components/searcher.jsx'
import verifyToken from '../fetchs/verifyToken.jsx'
import fetchRoutines from '../fetchs/fetchAllRoutines.jsx';
import CustomTable from '../real_components/Table4columns.jsx';

function BarAnimation({ routines, isSmallScreen }) {
    const orderedRoutines = routines.sort((a, b) => b.cant_asignados - a.cant_asignados);  
    const routineNames = orderedRoutines?.map(routine => routine.name);
    const routineData = orderedRoutines?.map(routine => routine.cant_asignados);

    
    const routinesData = routines?.map(routine => ({
      label: routine.name,
      value: routine.cant_asignados, 
    }));

    return (
        <Box sx={{display: 'flex', alignItems: 'center',backgroundColor:'#F5F5F5',marginTop:'10px',borderRadius:'10px',marginLeft:'2px',marginBottom: '5vh',marginLeft: '5vh',marginTop:'8vh',marginRight: '5vh'}}>
          <BarChart
            height={250}
            series={[{
              data: routineData.slice(0, 5),
              valueFormatter: (item) => `${item} users`,
            }]}
            sx={{transition: 'none !important'}}
            xAxis={[{
              scaleType: 'band',
              data: routineNames.slice(0, 5),
            }]}   
          />
          {!isSmallScreen && (
          <PieChart
            height={250}
             legend= {{ hidden: true }}
                series={[{
                  data: routinesData.slice(0,5),
                  innerRadius: 50,
                  valueFormatter: (item) => `${item.value} users`,              
                }]}
          />
        )}          
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
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);

  const handleCloseSearch = () => {
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

  function ECommerce({event}) {
    
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'20%'}}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{selectedEvent.name}</MDBTypography>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-4" style={{ alignItems: 'center' }}>
                      <div className="position-relative d-inline-block" style={{ width: '10vh', height: '10vh' }}>                        
                        <FavoriteIcon sx={{ color: 'red', width: '10vh', height: '10vh' }} />
                        <p
                          className="position-absolute top-50 start-50 translate-middle"
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight:'bold',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '50%',
                            minWidth: '2rem',
                            textAlign: 'center',
                          }}
                        >
                          {selectedEvent.cant_asignados}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3 text-center">
                      <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                        <p className="mb-0 me-2" style={{ color: '#424242' }}>
                          {selectedEvent.description}
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div style={{justifyContent:'center',display:'flex'}}>
                      <button onClick={handleViewExercises} className='buttons-formated'>View exercises</button>
                    </div>
                    <button 
                      onClick={handleCloseModal}
                      className="custom-button-go-back-managing"
                      style={{
                        zIndex: '2',
                        position: 'absolute', 
                        top: '1%',
                        left: isSmallScreen ? '78%' : '80%',
                      }}
                    >
                      <CloseIcon sx={{ color: '#F5F5F5' }} />
                    </button>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  }


    return (
      <div className="App">
        {!userMail ? (
          <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={true}>
              <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          <div style={{width:'100%'}}>
            {selectedEvent && (
                <ECommerce event={selectedEvent}/>
            )}
            <NewLeftBar/>
            <Searcher filteredValues={filterRoutines} setFilterValues={setFilterRoutines} isSmallScreen={isSmallScreen} searchingParameter={'routine name'}/>
            <div style={{width:'100%'}}>
              {routines && (
                <CustomTable columnsToShow={['Name','Owner','Exercises','Likes','There are no created routines']} data={routines} handleSelectEvent={handleSelectEvent} vals={['name','owner','exercise_length','cant_asignados']}/> 
              )}
              <div>
                <BarAnimation routines={routines} isSmallScreen={isSmallScreen}/>
              </div>
              
            </div>
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
          </div>
        )}
      </div>
    );
}

export default TopRoutines;
