import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import Box from '@mui/material/Box';
import verifyToken from '../fetchs/verifyToken.jsx';
import Calendar from '../real_components/Calendar.jsx';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import EnhancedTable from '../real_components/TableClasses.jsx';
import WarningConnectionAlert from '../real_components/WarningConnectionAlert.jsx';
import ErrorTokenAlert from '../real_components/ErrorTokenAlert.jsx';
import SuccessAlert from '../real_components/SuccessAlert.jsx';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import Loader from '../real_components/loader.jsx'
import Button from '@mui/material/Button';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import formatDate from '../functions/formatDate.jsx'
import Searcher from '../real_components/searcher.jsx';

export default function Main_Page() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [userMail,setUserMail] = useState(null);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [successBook,setSuccessBook] = useState(false);
  const [successUnbook,setSuccessUnbook] = useState(false);
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  const diaActual = diasSemana[new Date().getDay()];
  const isSmallScreen = useMediaQuery('(max-width:250px)');
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [type, setType] = useState(null);
  const [califyModal, setCalifyModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [visibleDrawerAchievements, setVisibleDrawerAchievements] = useState(false);
  const [progress,setProgress] = useState();
  const [newRows, setNewRows] = useState([]);
  const [errorStars, setErrorStars] = useState(false);
  const [errorComment, setErrorComment] = useState(false);
  const [membership, setMembership] = useState([])
  const [userAccount, setUserAccount] = useState([])
  const [changingStars,setChangingStars] = useState(false)
  const [changingComment,setChangingComment] = useState(false)
  const [viewQualifications, setViewQualifications] = useState(false)


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
      
      const response3 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_memb_user`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
      });
      if (!response3.ok) {
          throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
      }
      const data3 = await response3.json();
      const membershipsOfUser = data3.filter(memb => memb.userId == data.uid)
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      const membresiaFiltered = membershipsOfUser.filter(memb => memb.exp.split('T')[0] > formattedDate); 
      const membershipIds = membresiaFiltered.map(memb => memb.membershipId);
      const response2 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_memberships`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const membresia = await response2.json();
      const firstFiler = membresia.filter(memb => membershipIds.includes(memb.id))
      setMembership(firstFiler)
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const handleViewAchievements = () => {
    setOpenAchievements(true);
    setVisibleDrawerAchievements(true);
  }

  const handleCloseAchievements = () => {
    setOpenAchievements(false);
      setTimeout(() => {
        setVisibleDrawerAchievements(false);
      }, 450);
  }
  
  
  const handleChangeCalifyModal = () => {
    setComment(selectedEvent.comentario)
    setStars(selectedEvent.puntuacion)
    setCalifyModal(!califyModal);
  }

  const handleViewQualifications = () => {
    setViewQualifications(!viewQualifications)
  }

  const handleStarsChange = (e) => {
    const newStars = parseInt(e.target.value);
    setChangingStars(true)
    setStars(newStars);
  }

 
  function HalfRating() {
    return (
      <Stack spacing={1}>
        <Rating name="half-rating"
          value={stars}
          onChange={handleStarsChange}
          defaultValue={stars} />
      </Stack>
    );
  }

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

  useEffect(() => {
    const newRowsList = [];
    const filteredClassesSearcher = filterClasses
      ? totalClasses.filter(item =>
          item.name.toLowerCase().startsWith(filterClasses.toLowerCase())
        )
      : totalClasses;
  
    filteredClassesSearcher.forEach(row => {
      if (
        (row.permanent === 'No' &&
          new Date(row.dateInicio).getTime() - new Date().getTime() <= 6 * 24 * 60 * 60 * 1000 &&
          new Date(row.dateInicio).getTime() >= new Date().setHours(0, 0, 0, 0)) ||
        (row.permanent === 'Si' &&
          new Date(row.start).getTime() - new Date().getTime() <= 6 * 24 * 60 * 60 * 1000 &&
          new Date(row.start).getTime() >= new Date().setHours(0, 0, 0, 0))
      ) {
        newRowsList.push(row);
      }
    });
  
    setNewRows(newRowsList);
  }, [filterClasses, totalClasses]);

  function ECommerce({event}) {
    
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'40%'}}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{event.name}</MDBTypography>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <p className="small mb-0" style={{color: '#424242' }}><AccessAlarmsIcon sx={{ color: '#48CFCB'}} />{event.dateInicio.split('T')[1].split(':').slice(0, 2).join(':')} - {event.dateFin.split('T')[1].split(':').slice(0, 2).join(':')}</p>
                        <p className="fw-bold mb-0" style={{color: '#424242' }}>{event.permanent === 'No' ? formatDate(new Date(event.dateInicio)) : formatDate(new Date(event.start))}</p>
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
                          {userMail && type==='client' && selectedEvent.BookedUsers.includes(userMail) && (
                            <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }} onClick={handleChangeCalifyModal}>Calify</MDBBtn>
                          )}
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
                    {userMail && type === 'client' && (
                      (event.permanent === 'No' &&
                      (new Date(event.dateInicio).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                      (new Date(event.dateInicio).getTime() >= new Date().setHours(0, 0, 0, 0))
                      )
                      ||
                      (event.permanent === 'Si' && 
                      (new Date(event.start).getTime() - new Date().getTime() <= 7 * 24 * 60 * 60 * 1000) &&
                      (new Date(event.start).getTime() >= new Date().setHours(0, 0, 0, 0))
                      )
                    )
                      ? (
                        <>
                        {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(userMail)  ? (
                          <>
                          { event.day === diaActual &&  (new Date(event.sourceDate).getTime() - new Date().getTime() <= 0)  ? (
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
                            </>
                            ) : (
                              <>
                              {!membership[0] ? (
                                <MDBBtn
                                  style={{ backgroundColor: 'red', color: 'white', width: '70%', left: '15%' }} 
                                  rounded
                                  block
                                  size="lg"
                                  
                                >
                                  You dont have an active membership
                                </MDBBtn>
                                ) : (
                                <>
                                {selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                                  <>
                                  {membership[0].BookedClasses.length<membership[0].top ? (
                                    <MDBBtn
                                    style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                                    rounded
                                    block
                                    size="lg"
                                    onClick={() => handleBookClass(event.id)}
                                  >
                                    Book
                                  </MDBBtn>
                                  ) : (
                                    <MDBBtn
                                    style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                                    rounded
                                    block
                                    size="lg"
                                  >
                                    Upgrade your plan
                                  </MDBBtn>
                                  )}
                                  </>
                                ) : (
                                <MDBBtn
                                  style={{ backgroundColor: 'red', color: 'white', width: '70%', left: '15%' }} 
                                  rounded
                                  block
                                  size="lg"
                                >
                                  FULL
                                </MDBBtn>
                                )}
                                </>)
                                }
                                </>
                        )}
                        <button 
                          onClick={handleCloseModal}
                          className="custom-button-go-back-managing"
                          style={{
                            zIndex: '2',
                            position: 'absolute', 
                            top: '1%',
                            left: isSmallScreen700 ? '88%' : '90%', 
                          }}
                        >
                          <CloseIcon sx={{ color: '#F5F5F5' }} />
                        </button>
                        </>
                        ) : (
                          <>
                        {selectedEvent.permanent==='No' && (
                        <>
                        {userMail && type === 'client' && selectedEvent.BookedUsers && selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                          <>
                           {selectedEvent.BookedUsers.includes(userMail)  ? (
                             <MDBBtn
                             style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                             rounded
                             block
                             size="lg"
                             onClick={() => handleUnbookClass(event.id)}
                           >
                             Unbook
                           </MDBBtn>
                           ) : (
                            <>
                            {userAccount.Gemas>0 ? (
                            <MDBBtn
                              style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                              rounded
                              block
                              size="lg"
                              onClick={() => handleBookClassWithGem(event.id)}
                            >
                              <DiamondIcon />
                              Use gem
                              <DiamondIcon />
                            </MDBBtn>
                            ) : (
                              <MDBBtn
                                style={{ backgroundColor: 'red', color: 'white', width: '70%', left: '15%' }} 
                                rounded
                                block
                                size="lg"
                              >
                                You dont have gems
                              </MDBBtn>
                            )}
                            </>
                          )}
                          </>
                        ) : (
                          <>
                          {userMail && type === 'client' ? (
                            <>
                              {selectedEvent.BookedUsers && selectedEvent.BookedUsers.includes(userMail)  ? (
                                <MDBBtn
                                style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                                rounded
                                block
                                size="lg"
                                onClick={() => handleUnbookClass(event.id)}
                              >
                                Unbook
                              </MDBBtn>
                              ) : (
                                <MDBBtn
                                style={{ backgroundColor: 'red', color: 'white', width: '70%', left: '15%' }} 
                                rounded
                                block
                                size="lg"
                              >
                                Full
                              </MDBBtn>
                              )}
                              </>
                          ) : (
                            null
                          )}
                        </>
                        )}
                        </>
                        )}
                        
                          <button 
                            onClick={handleCloseModal}
                            className="custom-button-go-back-managing"
                            style={{
                              zIndex: '2',
                              position: 'absolute', 
                              top: '1%',
                              left: isSmallScreen700 ? '88%' : '90%',
                            }}
                          >
                            <CloseIcon sx={{ color: '#F5F5F5' }} />
                          </button>
                          </>
                        )}
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  }

  const changeShowCalendar = () => {
    setShowCalendar(prevState => !prevState);
    handleCloseModal();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCommentChange = (event) => {
    setComment(event)
    setChangingComment(true)
  }
  
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true)
    try {
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_salas');
      if (!response2.ok) {
        throw new Error('Error al obtener las salas: ' + response2.statusText);
      }
      const salas = await response2.json();
  
      const dataWithSala = data.map(clase => {
        const salaInfo = salas.find(sala => sala.id === clase.sala);
        return {
          ...clase,
          salaInfo, 
        };
      });
  
      const calendarEvents = [];
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
      console.log(calendarEvents)
      setEvents(calendarEvents);
      setOpenCircularProgress(false)
      setTotalClasses(calendarEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setWarningConnection(true);
      setOpenCircularProgress(false)
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
  };

  const handleBookClassWithGem = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/book_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/use_membership_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id: event,membId:membership[0].id })
      });
      if (!response2.ok) {
        throw new Error('Error al actualizar la clase: ' + response2.statusText);
      }

      const response3 = await fetch('https://two025-duplagalactica-final.onrender.com/use_geme', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({mail:userMail})
      });
      if (!response3.ok) {
        throw new Error('Error al actualizar la clase: ' + response3.statusText);
      }


      await fetchClasses();
      window.location.reload();
      handleCloseModal();
      setTimeout(() => {
        setSuccessBook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    
  };

  const handleBookClass = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/book_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/use_membership_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id: event,membId:membership[0].id })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      window.location.reload();
      setOpenCircularProgress(false);
      handleCloseModal();
      //setSucceshandleClosesBook(true)
      setTimeout(() => {
        setSuccessBook(false);
      }, 3000);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    
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
        body: JSON.stringify({ event: event,mail:userMail })
      });
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/unuse_membership_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ id: event,membId:membership[0].id })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      window.location.reload();
      handleCloseModal();
      setSuccessUnbook(true);
      setTimeout(() => {
        setSuccessUnbook(false);
      }, 3000);
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
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
    } else {
        console.error('No token found');
    }
    
  }, [userAccount]);

  useEffect(()=> {
    if (userAccount) {
      fetchClasses();
      fetchMissions();
      fetchMissionsProgress();
    }
  },[userAccount])

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail, showCalendar]);

  const handleClaimMission = async (missionProgressId) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const formData = new FormData();
      formData.append('misiones', missionProgressId);
      const response5 = await fetch('https://two025-duplagalactica-final.onrender.com/delete_missions', {
        method: 'DELETE', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });
      if (!response5.ok) {
        throw new Error('Error al actualizar la clase: ' + response5.statusText);
      }
      window.location.reload();
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  }

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
        await fetchClasses();
        setOpenCircularProgress(false);
        handleChangeCalifyModal()
        handleCloseModal();
      } catch (error) {
          console.error("Error fetching user:", error);
      }
    }
  }

  const fetchMissions = async () =>{
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response4 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_missions_progress`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const missions = await response4.json();
      const missionsIds = missions.filter(mis => mis.uid === userAccount.uid).map(mis => mis.idMission)
      const formData = new FormData();
      formData.append('misiones', missionsIds);
      formData.append('uid',userAccount.uid)
      if (missionsIds.length!=0) {
        console.log("entre al mission progress")
        const response5 = await fetch('https://two025-duplagalactica-final.onrender.com/add_mission_progress', {
          method: 'DELETE', 
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        });
        if (!response5.ok) {
          throw new Error('Error al actualizar la clase: ' + response5.statusText);
        }
      } 
    } catch (e) {

    }
  }

  const traducirDia = (diaEspañol) => {
    if (diaEspañol=='Lunes') {
      return 'Monday'
    } else if (diaEspañol=='Martes') {
      return 'Tuesday'
    } else if (diaEspañol=='Miercoles') {
      return 'Wednesday'
    } else if (diaEspañol=='Jueves'){
      return 'Thursday'
    } else if (diaEspañol=='Viernes') {
      return 'Friday'
    } else if (diaEspañol=='Sabado') {
      return 'Saturday'
    } else if (diaEspañol=='Domingo') {
      return 'Sunday'
    }
  }

  const fetchMissionsProgress = async () =>{
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response4 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_missions_progress`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const missions = await response4.json();
      const progress = missions.filter(mis => mis.uid === userAccount.uid)
      if (progress.length<3 && (userAccount.length!=0)) {
        const formData = new FormData();
        formData.append('cant', (3-progress.length));
        formData.append('uid', userAccount.uid);
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/assign_mission', {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${authToken}`
              },
              body: formData,
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la clase: ' + response5.statusText);
        }
        window.location.reload();
      }
      const response5 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_missions_template`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      if (!response5.ok) {
        throw new Error('Error al actualizar la clase: ' + response5.statusText);
      } 
      const templates = await response5.json();
      const enrichedProgress = progress.map(mission => {
        const template = templates.find(temp => temp.id === mission.mid);
        return template ? { ...mission, ...template } : mission;
      });
      setProgress(enrichedProgress)
    } catch (e) {
    }
  }

  
  return (
    <div className="App">
      {circularProgressClasses ? (<><loader></loader></>):(<></>)}
      <SuccessAlert successAlert={successBook} message={'Successfully Booked!'}/>
      <SuccessAlert successAlert={successUnbook} message={'Successfully Unbooked!'}/>
      <WarningConnectionAlert warningConnection={warningConnection}/>
      <ErrorTokenAlert errorToken={errorToken}/>
      <NewLeftBar/>
      {type==='client' && showCalendar ? (
        <>
        <div className='input-container-buttons' style={{left: isSmallScreen700 ? '6vh' : '8vh', position: 'absolute', top: '0.5%'}}>
          <div className='input-small-container-buttons' onClick={handleViewAchievements}>
            <Button onClick={handleViewAchievements}
              style={{
                  backgroundColor: '#48CFCB',
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
              <EmojiEventsIcon sx={{ color: '#424242' }} />
            </Button>
          </div>
        </div>
        <div className='input-container-buttons' style={{left: isSmallScreen700? '12vh' : '16vh', position: 'absolute', top: '0.5%'}}>
          <div className='input-small-container-buttons'>
            <Button
              style={{
                  backgroundColor: '#48CFCB',
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
              <DiamondIcon sx={{ color: 'light green' }} />
              <>{userAccount.Gemas}</>
            </Button>
          </div>
        </div>
        </>
      ):(
      <>
      </>)
      }
      {visibleDrawerAchievements && type === 'client' && (
        <div className="modal-achievements" onClick={handleCloseAchievements}>
          <div
            className={`modal-achievements-content ${!openAchievements ? 'hide' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'grid', gridTemplateColumns: isSmallScreen700 ? '1fr' : 'repeat(3, 1fr)', gap: 2 }}>
              {progress.slice(0, 3).map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    padding: 2,
                    backgroundColor: '#1e1e1e',
                    borderRadius: '8px',
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6" color="#adb5bd">
                    Attend {item.Objective} class on {traducirDia(item.Day)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginY: 1 }}>
                    <Box sx={{ width: '75%', mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(item.progress * 100) / item.Objective}
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ minWidth: 35 }}>
                      {Math.min((item.progress * 100) / item.Objective, 100)}%
                    </Typography>
                  </Box>

                  {item.progress >= item.Objective ? (
                    <button
                      className="claim-button"
                      onClick={() => handleClaimMission(item.idMission)}
                      style={{ padding: '8px', marginTop: '10px', cursor: 'pointer', backgroundColor: '#386641', borderRadius: '8px' }}
                    >
                      CLAIM REWARD
                    </button>
                  ) : (
                    <button
                      className="not-claimable-button"
                      disabled
                      style={{ padding: '8px', marginTop: '10px', cursor: 'not-allowed', opacity: 0.6, borderRadius: '8px' }}
                    >
                      CLAIM REWARD
                    </button>
                  )}
                </Box>
              ))}
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

      {!isSmallScreen ? (
      <>
        <div className="Calendar-Button">
          {showCalendar ? (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show table
            </button>
          ) : (
            <button onClick={changeShowCalendar} className="Toggle-Button">
              Show calendar
            </button>
          )}
        </div>
        {showCalendar ? (
        <div className="WebApp-Body">
          <Calendar events={events} onSelectEvent={handleSelectEvent} />
        </div>
        ) : (
          <>
           <Searcher filteredValues={filterClasses} setFilterValues={setFilterClasses} isSmallScreen={isSmallScreen} searchingParameter={'class name'}/>
           <div className="Table-Container">
            <EnhancedTable newRows={newRows} user={userMail} userType={type} handleSelectEvent={handleSelectEvent}/>
          </div>
        </>
      )}
      </>
    ) : (
      <>
      <div className='leftBar' style={{zIndex:'1000'}}>
      <Searcher filteredValues={filterClasses} setFilterValues={setFilterClasses} isSmallScreen={isSmallScreen} searchingParameter={'class name'}/>
    </div>
    <div className="Table-Container">
      <EnhancedTable newRows={newRows} user={userMail} userType={type} handleSelectEvent={handleSelectEvent}/>
    </div>
  </>
    )}
  {selectedEvent && (
    <ECommerce event={selectedEvent}/>
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
            <button onClick={handleChangeCalifyModal}>Cancel</button>
            <button onClick={() => saveCalification(selectedEvent)} style={{marginLeft:'10px'}}>Send</button>
          </div>
        </div>
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
    </div>
  );
}
