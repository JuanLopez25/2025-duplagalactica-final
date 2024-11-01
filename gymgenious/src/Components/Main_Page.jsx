import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import {jwtDecode} from "jwt-decode";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import CheckIcon from '@mui/icons-material/Check';
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
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Loader from '../real_components/loader.jsx'
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DiamondIcon from '@mui/icons-material/Diamond';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardCount = 10;
  const visibleCards = 5;

  const maxIndex = Math.ceil(cardCount / visibleCards) - 1;

  const nextGroup = () => {
    setCurrentIndex(currentIndex < maxIndex ? currentIndex + 1 : 1);
  };

  const prevGroup = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : 0);
  };

  return (
    <div style={{ width: '100%', height: '40%', overflow: 'hidden', position: 'relative'}}>
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.3s ease-in-out',
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        {Array.from({ length: cardCount }, (_, index) => (
          <div
            key={index}
            style={{
              minWidth: `${100 / visibleCards}%`,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="card">achievement {index + 1}</div>
          </div>
        ))}
      </div>

      <button onClick={prevGroup} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }}>
        {'<'}
      </button>
      <button onClick={nextGroup} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}>
        {'>'}
      </button>
    </div>
  );
};

export default function Main_Page() {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [leftBarOption, setLeftBarOption] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [userMail,setUserMail] = useState(null);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [successBook,setSuccessBook] = useState(false);
  const [successUnbook,setSuccessUnbook] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:250px)');
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [type, setType] = useState(null);
  const [califyModal, setCalifyModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [openAchievements, setOpenAchievements] = useState(false);
  const [visibleDrawerAchievements, setVisibleDrawerAchievements] = useState(false);

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
  
  const [membership, setMembership] = useState([])
  const [userAccount, setUserAccount] = useState([])
  const [amountClasses,setAmountClasses] = useState(0)
  const [changingStars,setChangingStars] = useState(false)
  const [changingComment,setChangingComment] = useState(false)
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const handleChangeCalifyModal = () => {
    setStars(selectedEvent.puntuacion)
    setCalifyModal(!califyModal);
  }

  const handleStarsChange = (e) => {
    const newStars = parseInt(e.target.value);
    setChangingStars(true)
    setStars(newStars);
  }

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setClasses(totalClasses);
  };
  
  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

  function ECommerce({event}) {
    
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
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
                          {userMail && type==='client' && (
                            <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }} onClick={handleChangeCalifyModal}>Calify</MDBBtn>
                          )}    
                          {userMail && type==='coach' && (
                            <>
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.averageCalification}</MDBBtn>
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.commentaries}</MDBBtn>
                            </>
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
                              {selectedEvent.BookedUsers.length<selectedEvent.capacity  && membership[0].BookedClasses.length<membership[0].top? (
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
                              <>
                              {selectedEvent.BookedUsers.length<selectedEvent.capacity ? (
                                <>
                                <MDBBtn
                                  style={{ backgroundColor: 'RED', color: 'white', width: '70%', left: '15%' }} 
                                  rounded
                                  block
                                  size="lg"
                                >
                                  Book
                                </MDBBtn>
                                </>
                              ) :
                              (
                              <>
                              <MDBBtn
                                style={{ backgroundColor: '#48CFCB', color: 'white' }} 
                                rounded
                                block
                                size="lg"
                              >
                                FULL
                              </MDBBtn>
                              </>
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
    handleCloseSearch();
    handleCloseModal();
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    handleCloseSearch();
  };

  const handleCommentChange = (event) => {
    setComment(event)
    setChangingComment(true)
  }
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const fetchClasses = async () => {
    setOpenCircularProgress(true);
    try {
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      
      const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_salas');
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
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response3 = await fetch('http://127.0.0.1:5000/get_comments');
      if (!response3.ok) {
        throw new Error('Error al obtener los comentarios: ' + response3.statusText);
      }
      const data3 = await response3.json();
      const filteredComments = data3.filter(comment => comment.uid === userAccount.uid);
      const dataWithSalaAndComments = dataWithSala.map(clase => {
        const comment = filteredComments.find(c => c.cid === clase.id);
        return {
          ...clase,
          comentario: comment ? comment.commentary : null,
          puntuacion: comment ? comment.calification : -1,
        };
      });
      
      dataWithSalaAndComments.forEach(clase => {
        const startDate = new Date(clase.dateInicio);
        const CorrectStarDate = new Date(startDate.getTime() + 60 * 3 * 60 * 1000);
        const endDate = new Date(clase.dateFin);
        const CorrectEndDate = new Date(endDate.getTime() + 60 * 3 * 60 * 1000);
  
        if (clase.permanent === "Si") {
          let nextStartDate = new Date(CorrectStarDate);
          let nextEndDate = new Date(CorrectEndDate);
  
          if (nextStartDate < today) {
            const dayOfWeek = CorrectStarDate.getDay();
            let daysUntilNextClass = (dayOfWeek - today.getDay() + 7) % 7;
            if (daysUntilNextClass === 0 && today > CorrectStarDate) {
              daysUntilNextClass = 7;
            }
            nextStartDate.setDate(today.getDate() + daysUntilNextClass);
            nextEndDate = new Date(nextStartDate.getTime() + (CorrectEndDate.getTime() - CorrectStarDate.getTime()));
          }
          
          for (let i = 0; i < 4; i++) {
            calendarEvents.push({
              title: clase.name,
              start: new Date(nextStartDate),
              end: new Date(nextEndDate),
              allDay: false,
              ...clase,
            });
            nextStartDate.setDate(nextStartDate.getDate() + 7);
            nextEndDate.setDate(nextEndDate.getDate() + 7);
          }
        } else {
          if(startDate >= today)
          calendarEvents.push({
            title: clase.name,
            start: new Date(CorrectStarDate),
            end: new Date(CorrectEndDate),
            allDay: false,
            ...clase,
          });
        }
      });
      setOpenCircularProgress(false);
      console.log(calendarEvents)
      setEvents(calendarEvents);
      setClasses(dataWithSalaAndComments);
      setTotalClasses(dataWithSala);
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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/book_class', {
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
      const response2 = await fetch('http://127.0.0.1:5000/use_membership_class', {
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
      setOpenCircularProgress(false);
      handleCloseModal();
      setSuccessBook(true)
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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/unbook_class', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      const response2 = await fetch('http://127.0.0.1:5000/unuse_membership_class', {
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
      setOpenCircularProgress(false);
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
    let token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
    if (userAccount) {
      fetchClasses();
      fetchMissions()
    }
  }, [userAccount]);

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail, showCalendar]);

  useEffect(() => {
    if(filterClasses!=''){
      const filteredClassesSearcher = totalClasses.filter(item => 
        item.name.toLowerCase().startsWith(filterClasses.toLowerCase())
      );
      setClasses(filteredClassesSearcher);
    } else {
      setClasses(totalClasses);
    }

  }, [filterClasses]);


  const saveCalification = async (event) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      let starsValue = changingStars ? stars : event.puntuacion;
      let commentValue = changingComment ? comment : event.comentario;
      const response = await fetch('http://127.0.0.1:5000/add_calification', {
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
        console.error("Error fetching user:", error);
    }
  }


  const fetchMissions = async () =>{
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response4 = await fetch(`http://127.0.0.1:5000/get_missions`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const missions = await response4.json();
      const missionsIds = missions.filter(mis => mis.uid === userAccount.uid).map(mis => mis.id)
      console.log("misiones",missionsIds)
      const formData = new FormData();
      formData.append('misiones', missionsIds);
      if (missionsIds.length!=0) {
        const response5 = await fetch('http://127.0.0.1:5000/delete_missions', {
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
      setUserAccount(data)
      setType(data.type);
      console.log("este es el usuario",data)
      setOpenCircularProgress(false);
      const response3 = await fetch(`http://127.0.0.1:5000/get_memb_user`, {
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
      const response2 = await fetch(`http://127.0.0.1:5000/get_memberships`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      });
      const membresia = await response2.json();
      const firstFiler = membresia.filter(memb => membershipIds.includes(memb.id))
      console.log("membresia",firstFiler)
      setMembership(firstFiler)
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };
  
  return (
    <div className="App">
      {circularProgressClasses ? (<><loader></loader></>):(<></>)}
      <SuccessAlert successAlert={successBook} message={'Successfully Booked!'}/>
      <SuccessAlert successAlert={successUnbook} message={'Successfully Unbooked!'}/>
      <WarningConnectionAlert warningConnection={warningConnection}/>
      <ErrorTokenAlert errorToken={errorToken}/>
      <NewLeftBar/>
      {type==='client' && (
        <>
        <div className='input-container' style={{marginLeft: isSmallScreen700 ? showCalendar ? '60px' : openSearch ? '220px' : '114px' : showCalendar ? '50px' : openSearch ? '360px' :'96px', width: isSmallScreen700 ? '50%' : '30%', position: 'absolute', top: '0.5%'}}>
          <div className='input-small-container'>
            <Button onClick={handleViewAchievements}
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
              <EmojiEventsIcon sx={{ color: '#424242' }} />
            </Button>
          </div>
        </div>
        <div className='input-container' style={{marginLeft: isSmallScreen700 ? showCalendar ? '60px' : openSearch ? '220px' : '114px' : showCalendar ? '50px' : openSearch ? '360px' :'96px', width: isSmallScreen700 ? '50%' : '30%', position: 'absolute', top: '0.5%'}}>
          <div className='input-small-container'>
            <Button
              style={{
                  backgroundColor: '#48CFCB',
                  position: 'absolute',
                  borderRadius: '50%',
                  width: '5vh',
                  height: '5vh',
                  minWidth: '0',
                  minHeight: '0',
                  left: '40px',
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
      )}
      {visibleDrawerAchievements && type==='client' && (
        <div className='modal-achievements' onClick={handleCloseAchievements}>
          <div className={`modal-achievements-content ${!openAchievements ? 'hide' : ''}`} onClick={(e)=>e.stopPropagation()}>
            <Carousel/>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: '75%', mr: 1 }}>
                <LinearProgress variant="determinate" value={25} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  25%
                </Typography>
              </Box>
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
            <div className='input-container' style={{marginLeft: isSmallScreen700 ? '60px' : '50px', width: isSmallScreen700 ? '150px' : '300px', position: 'absolute', top: '0.5%'}}>
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
                    id={filterClasses}
                    onChange={(e) => setFilterClasses(e.target.value)} 
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
            <EnhancedTable rows={events} user={userMail} userType={type} handleSelectEvent={handleSelectEvent}/>
          </div>
        </>
      )}
      </>
  ) : (
    <>
    <div className='leftBar' style={{zIndex:'1000'}}>
      {openSearch ? (
          <input
          type="text"
          className="search-input"
          placeholder="Search..."
          style={{
            position: 'absolute',
            top: '0.5vh',
            left: '7vh',
            width: '60vh',
            height: '5vh',
            borderRadius: '10px',
            padding: '0 10px',
            transition: 'all 0.3s ease',
          }}
          id={filterClasses}
          onChange={(e) => setFilterClasses(e.target.value)} 
        />
      ) : (
        <Button onClick={handleOpenSearch}
        style={{
          backgroundColor: '#48CFCB',
          position: 'absolute',
          borderRadius: '50%',
          top: '0.5vh',
          left: '7vh ',
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
  <div className="Table-Container">
    <EnhancedTable rows={events} user={userMail} userType={type} handleSelectEvent={handleSelectEvent}/>
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
                    <input 
                    type="number" 
                    id="stars" 
                    name="stars"
                    value={stars}
                    min="1"
                    step='1'
                    max="5"
                    onChange={handleStarsChange}
                    />
                </div>
                <div className="input-small-container">
                    <label htmlFor="comment" style={{color:'#14213D'}}>Comment:</label>
                    <input 
                    type="text" 
                    id="comment" 
                    name="comment" 
                    placeholder={selectedEvent.comentario}
                    value={comment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    />
                </div>
            </div>
            <button onClick={handleChangeCalifyModal}>Cancel</button>
            <button onClick={() => saveCalification(selectedEvent)} style={{marginLeft:'10px'}}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
