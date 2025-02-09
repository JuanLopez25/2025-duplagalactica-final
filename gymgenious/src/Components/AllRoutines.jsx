import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';
import NewLeftBar from '../real_components/NewLeftBar';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import CustomTable from '../real_components/Table4columns.jsx'
import TableBody from '@mui/material/TableBody';
import CloseIcon from '@mui/icons-material/Close';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Table from '@mui/material/Table';
import fetchRoutines from '../fetchs/fetchAllRoutines.jsx';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Searcher from '../real_components/searcher.jsx';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import fetchUser from '../fetchs/fetchUser.jsx';
import verifyToken from '../fetchs/verifyToken.jsx';

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
  const [filterRoutines, setFilterRoutines] = useState('');
  const [totalRoutines, setTotalRoutines] = useState([]);
  const isSmallScreen = useMediaQuery('(max-width:700px)');
 
  const handleCloseSearch = () => {
    setRoutines(totalRoutines);
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
          verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken)
      } else {
          navigate('/');
          console.error('No token found');
      }
  }, []);

  useEffect(() => {
    if (type!='coach' && type!=null) {
      navigate('/');      
    }
  }, [type]);
    
  useEffect(() => {
      if (userMail) {
          fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection)
          fetchRoutines(setOpenCircularProgress, setTotalRoutines, setRoutines,setWarningConnection);
      }
  }, [userMail]);

  const handleSelectEvent = (event) => {
  setSelectedEvent(event);
  handleCloseSearch();
  };


  function ECommerce({event}) {
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer style={{display:'flex', width: isSmallScreen ? '70%' : '40%'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
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

  const handleCloseModal = () => {
      setSelectedEvent(null);
      setViewExercises(false);
  };  

    return (
      <div className="App">
          <>
            <NewLeftBar/>
            <Searcher filteredValues={filterRoutines} setFilterValues={setFilterRoutines} isSmallScreen={isSmallScreen} searchingParameter={'routine name'}/>
            {routines && (
              <CustomTable columnsToShow={['Name','Owner','Excercises','Likes','There are no routines']} data={routines} handleSelectEvent={handleSelectEvent} vals={['name','owner','exercise_length','cant_asignados']}/> 
            )}  
            {selectedEvent && (
              <ECommerce event={selectedEvent}/>
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
      </div>
    );
}

export default AllRoutines;
