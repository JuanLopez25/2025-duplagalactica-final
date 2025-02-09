import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import Loader from '../real_components/loader.jsx';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import CustomTable from '../real_components/Table4columns.jsx'
import Searcher from '../real_components/searcher.jsx';
import verifyToken from '../fetchs/verifyToken.jsx';
import formatDate from '../functions/formatDate.jsx'

function UsserClasses() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail, setUserMail] = useState('');
  const [userAccount, setUserAccount] = useState([])
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [warningConnection, setWarningConnection] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [warningFetchingClasses, setWarningFetchingClasses] = useState(false);
  const [successUnbook, setSuccessUnbook] = useState(false);
  const [warningUnbookingClass, setWarningUnbookingClass] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [califyModal, setCalifyModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [changingStars,setChangingStars] = useState(false)
  const [changingComment,setChangingComment] = useState(false)
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [errorStars, setErrorStars] = useState(false);
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const diaActual = diasSemana[new Date().getDay()];
  const [errorComment, setErrorComment] = useState(false);
  const [newRows, setNewRows] = useState([]);
  const [viewQualifications, setViewQualifications] = useState(false);

  const fetchUser = async () => {
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
        setUserAccount(data)
        setType(data.type);
        if(data.type!='client'){
          navigate('/');
        }
        setOpenCircularProgress(false);
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

  function HalfRatingCoach() {
    return (
      <Stack spacing={1}>
        <Rating name="read-only"
          value={selectedEvent.averageCalification}
          precision={0.5}
          readOnly
          />
      </Stack>
    );
  }

  const handleViewQualifications = () => {
    setViewQualifications(!viewQualifications)
  }

  const handleCommentChange = (event) => {
    setComment(event)
    setChangingComment(true)
  }

  function HalfRating() {
    return (
      <Stack spacing={1}>
        <Rating name="half-rating"
          value={stars}
          onChange={handleStarsChange}
          defaultValue={stars}
          precision={0.5} />
      </Stack>
    );
  }

  const handleChangeCalifyModal = () => {
    setComment(selectedEvent.comentario)
    setStars(selectedEvent.puntuacion)
    setCalifyModal(!califyModal);
  }

  const handleStarsChange = (e) => {
    const newStars = parseInt(e.target.value);
    setChangingStars(true)
    setStars(newStars);
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
  const handleUnbookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/unbook_class', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event, mail: userMail,uid: userAccount.uid })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessUnbook(true);
      setTimeout(() => {
        setSuccessUnbook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      handleCloseModal();
      setWarningUnbookingClass(true);
      setTimeout(() => {
        setWarningUnbookingClass(false);
      }, 3000);
    }
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.BookedUsers.includes(userMail));
      console.log("filtered",filteredClasses)
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_salas');
      if (!response2.ok) {
        throw new Error('Error al obtener las salas: ' + response2.statusText);
      }
      const salas = await response2.json();
  
      const dataWithSala = filteredClasses.map(clase => {
        const salaInfo = salas.find(sala => sala.id === clase.sala);
        return {
          ...clase,
          salaInfo, 
        };
      });
      const response3 = await fetch('https://two025-duplagalactica-final.onrender.com/get_comments');
      if (!response3.ok) {
        throw new Error('Error al obtener los comentarios: ' + response3.statusText);
      }
      const data3 = await response3.json();
      const filteredComments = data3.filter(comment => comment.uid === userAccount.uid);
      const groupedComments = data3.reduce((acc, comment) => {
        if (!acc[comment.cid]) {
          acc[comment.cid] = { califications: [], commentaries: [] };
        }
        acc[comment.cid].califications.push(comment.calification);
        acc[comment.cid].commentaries.push(comment.commentary);
        return acc;
      }, {});
      
      const aggregatedComments = Object.entries(groupedComments).map(([cid, details]) => ({
        cid,
        averageCalification: details.califications.reduce((sum, cal) => sum + cal, 0) / details.califications.length,
        commentaries: details.commentaries
      }));
      
      const dataWithSalaAndComments = dataWithSala.map(clase => {
        const comment = filteredComments.find(c => c.cid === clase.id);
        const comments = aggregatedComments.find(comment => comment.cid === clase.id) || { averageCalification: 0, commentaries: [] };
        return {
          ...clase,
          comentario: comment ? comment.commentary : null,
          puntuacion: comment ? comment.calification : -1,
          ...comments
        };
      });

      const calendarEvents = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      dataWithSalaAndComments.forEach(clase => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(clase.dateInicio);
        const CorrectStarDate = new Date(startDate.getTime() + 60 * 3 * 60 * 1000);
        const endDate = new Date(clase.dateFin);
        const CorrectEndDate = new Date(endDate.getTime() + 60 * 3 * 60 * 1000);
        console.log("esto es el correct",(CorrectEndDate.getTime()-CorrectStarDate.getTime())/(1000*60))
        today.setHours(CorrectStarDate.getHours(), CorrectStarDate.getMinutes(), CorrectStarDate.getSeconds(), CorrectStarDate.getMilliseconds())
        if (clase.permanent === "Si") {
          let nextStartDate = CorrectStarDate;
          let nextEndDate = CorrectEndDate;
  
          if (nextStartDate < today) {
            const dayOfWeek = CorrectStarDate.getDay();
            let daysUntilNextClass = (dayOfWeek - today.getDay() + 7) % 7;
            today.setDate(today.getDate() + daysUntilNextClass);
            nextEndDate = new Date(today.getTime() + (nextEndDate.getTime() - nextStartDate.getTime()));
          } else {
            today.setDate(nextStartDate.getDate())
          }
          
          for (let i = 0; i < 4; i++) {
            calendarEvents.push({
              title: clase.name,
              start: new Date(today),
              end: new Date(nextEndDate),
              sourceDate: new Date(CorrectStarDate),
              allDay: false,
              ...clase,
            });
            today.setDate(today.getDate() + 7);
            nextEndDate.setDate(nextEndDate.getDate() + 7);
          }
        } else {
          if(startDate >= today)
          calendarEvents.push({
            title: clase.name,
            start: new Date(CorrectStarDate),
            end: new Date(CorrectEndDate),
            sourceDate: new Date(CorrectStarDate),
            allDay: false,
            ...clase,
          });
        }
      });

      const formattedRoutines = calendarEvents.map((routine) => {
        return {
            ...routine,
            startFecha: formatDate(routine.start), 
            dateInicioHora: new Date(new Date(routine.dateInicio).setHours(new Date(routine.dateInicio).getHours() + 3)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            recurrent: routine.permanent=='Si' ? 'Yes' : 'No'
        };
      });
      console.log(calendarEvents)
      setTotalClasses(formattedRoutines);
      setOpenCircularProgress(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false)
      setWarningFetchingClasses(true);
      setTimeout(() => {
        setWarningFetchingClasses(false);
      }, 3000);
    }
  };

  useEffect(() => {
      const newRowsList = [];
      const clasesAgregadas = [];
      const filteredClassesSearcher = filterClasses
        ? totalClasses.filter(item =>
            item.name.toLowerCase().startsWith(filterClasses.toLowerCase())
          )
        : totalClasses;
    
      filteredClassesSearcher.forEach(row => {
        if (!clasesAgregadas.includes(row.cid)){
          clasesAgregadas.push(row.cid)
          newRowsList.push(row);
        }
      });
      console.log("new rows",newRowsList)
      setNewRows(newRowsList);
    }, [filterClasses, totalClasses]);
  

  const validateCalification = () => {
    let res=true;
    setErrorStars(false);
    setErrorComment(false);
    if(stars===-1 || stars===null) {
      res=false;
      setErrorStars(true);
    }
    if(comment==='') {
      res=false;
      setErrorComment(true);
    }
    return res;
  }

  const saveCalification = async (event) => {
    if(validateCalification()) {
      setOpenCircularProgress(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        console.log("evento",event)
        let starsValue = changingStars ? stars : event.puntuacion;
        let commentValue = changingComment ? comment : event.comentario;
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/add_calification', {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ event: event.id,calification: starsValue,commentary: commentValue, user: userAccount.uid})
        });
        setChangingStars(false)
        setChangingComment(false)
        setOpenCircularProgress(false);
        await fetchClasses();
        setOpenCircularProgress(false);
        handleChangeCalifyModal()
        handleCloseModal();
      } catch (error) {
          console.error("Error saving calification:", error);
          setOpenCircularProgress(false)
          setWarningConnection(true);
          setTimeout(() => {
              setWarningConnection(false);
          }, 3000);
      }
    }
  }
  
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
        fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection);
    }
  }, [userMail]);


  useEffect(() => {
    if (type!='client' && type!=null) {
      navigate('/');      
    }
  }, [type]);


  useEffect(() => {
    if(type==='client' && userAccount){
        fetchClasses();
    }
  }, [type,userAccount])

  function ECommerce({event}) {
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer style={{display:'flex', width: isSmallScreen ? '90%' : '85%'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{event.name}</MDBTypography>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <p className="small mb-0" style={{color: '#424242' }}><AccessAlarmsIcon sx={{ color: '#48CFCB'}} />{event.dateInicio.split('T')[1].split(':').slice(0, 2).join(':')} - {event.dateFin.split('T')[1].split(':').slice(0, 2).join(':')}</p>
                        <p className="fw-bold mb-0" style={{color: '#424242' }}>{event.startFecha}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <div className="flex-shrink-0">
                        <MDBCardImage
                          style={{ width: '70px' }}
                          className="img-fluid rounded-circle border border-dark border-3"
                          src={event.sala=='cuyAhMJE8Mz31eL12aPO' ? `${process.env.PUBLIC_URL}/gimnasio.jpeg` : (event.sala=='PmQ2RZJpDXjBetqThVna' ? `${process.env.PUBLIC_URL}/salon_pequenio.jpeg` : (event.sala=='jxYcsGUYhW6pVnYmjK8H' ? `${process.env.PUBLIC_URL}/salon_de_functional.jpeg` : `${process.env.PUBLIC_URL}/salon_de_gimnasio.jpg`)) }
                          alt='Generic placeholder image'
                          fluid />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div className="d-flex flex-row align-items-center mb-2">
                          <p className="mb-0 me-2" style={{color: '#424242' }}>{selectedEvent.salaInfo.nombre}</p>
                        </div>
                        <div>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1"  style={{color: '#424242' }}>Capacity {event.capacity}</MDBBtn>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.permanent==='Si' ? 'Every week' : 'Just this day'}</MDBBtn>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }} onClick={handleChangeCalifyModal}>Calify</MDBBtn>
                          {event.averageCalification!==0 && event.commentaries?.length!==0 ? (
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }} onClick={handleViewQualifications}>qualifications</MDBBtn>
                            ) : (
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>no qualifications</MDBBtn>
                            )}
                        </div>
                      </div>
                    </div>
                    <hr />
                    <MDBCardText><CollectionsBookmarkIcon sx={{ color: '#48CFCB'}} /> {event.BookedUsers.length} booked users</MDBCardText>
                    <MDBCardText><EmailIcon sx={{ color: '#48CFCB'}} /> For any doubt ask "{event.owner}"</MDBCardText>
                      <button 
                        onClick={handleCloseModal}
                        className="custom-button-go-back-managing"
                        style={{
                          zIndex: '2',
                          position: 'absolute', 
                          top: '1%',
                          left: isSmallScreen? '88%' : '90%',
                        }}
                      >
                        <CloseIcon sx={{ color: '#F5F5F5' }} />
                      </button>
                      { event.day === diaActual &&  (new Date(event.sourceDate).getTime() - new Date().getTime() <= 0) ? (
                            <MDBBtn
                            style={{ backgroundColor: 'red', color: 'white', width: '70%', left: '15%' }} 
                            rounded
                            block
                            size="lg"
                          >
                            Class is today
                          </MDBBtn>
                          ) : (
                          <MDBBtn
                          style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                          rounded
                          block
                          size="lg"
                          onClick={() => handleUnbookClass(event.id)}
                        >
                          Unbook
                        </MDBBtn>
                          )}
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
          <>
      <NewLeftBar />
      <Searcher filteredValues={filterClasses} setFilterValues={setFilterClasses} isSmallScreen={isSmallScreen} searchingParameter={'classes name'}/>
      {newRows && (
              <CustomTable columnsToShow={['Name','Start time','Date','Recurren','There are no booked classes']} data={newRows} handleSelectEvent={handleSelectEvent} vals={['name','dateInicioHora','startFecha','recurrent']}/> 
      )}
      {openCircularProgress && (
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
          <Loader></Loader>
        </Backdrop>
      )}
      {errorToken && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="error">
                  Invalid Token!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      )}
      {successUnbook && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={successUnbook} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} icon={<CheckIcon fontSize="inherit" />} severity="success">
                  Successfully Unbooked!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      )}
      {warningFetchingClasses && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningFetchingClasses} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                  Error fetching classes. Try again!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
      )}
      {warningUnbookingClass && (
        <div className='alert-container'>
          <div className='alert-content'>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Slide direction="up" in={warningUnbookingClass} mountOnEnter unmountOnExit>
                <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                  Error unbooking class. Try again!
                </Alert>
              </Slide>
            </Box>
          </div>
        </div>
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
      </>
      {selectedEvent && (
        <ECommerce event={selectedEvent}/>
      )}
       {viewQualifications && (
        <div className="Modal" onClick={handleViewQualifications}>
          <div className="Modal-Content-qualifications" onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginBottom: '0px'}}>Qualifications</h2>
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
                {selectedEvent.name}
            </p>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginRight: '0px'}}>
                <div className="input-small-container" style={{flex: 1,marginRight: '0px'}}>
                     <label htmlFor="stars" style={{color:'#14213D'}}>Average Qualification:</label>
                    <HalfRatingCoach/>
                </div>
                <div className="input-small-container" style={{flex: 3}}>
                <label htmlFor="stars" style={{color:'#14213D'}}>Comments:</label>
                    <ul style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {selectedEvent.commentaries.map((cm) => (
                        <li style={{textOverflow: 'ellipsis', maxWidth: 'auto'}}>
                          {cm}
                        </li>
                      ))}
                    </ul>
                </div>
            </div>
            <button onClick={handleViewQualifications}>Close</button>
          </div>
        </div>
      )}
      {califyModal && (
        <div className="Modal" onClick={handleChangeCalifyModal}>
        <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
          <h2 style={{marginBottom: '0px'}}>Class</h2>
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
              {selectedEvent.name}
          </p>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
              <div className="input-small-container">
                   <label htmlFor="stars" style={{color:'#14213D'}}>Stars:</label>
                  <HalfRating/>
                  {errorStars && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Select stars</p>)}
              </div>
              <div className="input-small-container">
                  <label htmlFor="comment" style={{color:'#14213D'}}>Comment:</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    id="comment" 
                    name="comment"
                    rows={4}
                    maxLength={300}
                    style={{maxHeight: '150px', width: '100%', borderRadius: '8px'}}
                  />
                  {errorComment && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a comment</p>)}
              </div>
          </div>
          
          <button onClick={() => saveCalification(selectedEvent)} >Send</button>
          <button onClick={handleChangeCalifyModal} style={{marginLeft:'10px'}}>Cancel</button>
        </div>
      </div>
      )}
    </div>
  );
}

export default UsserClasses;
