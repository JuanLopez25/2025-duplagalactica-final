import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { jwtDecode } from "jwt-decode";
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import Loader from '../real_components/loader.jsx';
import moment from 'moment';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

function UsserClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userMail, setUserMail] = useState('');
  const [userAccount, setUserAccount] = useState([])
  const [classes, setClasses] = useState([]);
  const isSmallScreen400 = useMediaQuery('(max-width:360px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken, setErrorToken] = useState(false);
  const [warningFetchingClasses, setWarningFetchingClasses] = useState(false);
  const [successUnbook, setSuccessUnbook] = useState(false);
  const [warningUnbookingClass, setWarningUnbookingClass] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [warningConnection, setWarningConnection] = useState(false);
  const [califyModal, setCalifyModal] = useState(false);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [changingStars,setChangingStars] = useState(false)
  const [changingComment,setChangingComment] = useState(false)
  const [openSearch, setOpenSearch] = useState(false);
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [errorStars, setErrorStars] = useState(false);
  const [errorComment, setErrorComment] = useState(false);
  const [newRows, setNewRows] = useState([]);
  const [viewQualifications, setViewQualifications] = useState(false);

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

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setClasses(totalClasses);
  };

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

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/unbook_class', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event, mail: userMail })
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
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_classes');
      if (!response.ok) {
        throw new Error('Error al obtener las clases: ' + response.statusText);
      }
      const data = await response.json();
      const filteredClasses = data.filter(event => event.BookedUsers.includes(userMail));
      const response2 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_salas');
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
      const response3 = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_comments');
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
      setClasses(calendarEvents);
      setTotalClasses(calendarEvents);
      setOpenCircularProgress(false);
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
    const newRowsList = [];
  
    const filteredClassesSearcher = filterClasses
      ? totalClasses.filter(item =>
          item.name.toLowerCase().startsWith(filterClasses.toLowerCase())
        )
      : totalClasses;
  
    filteredClassesSearcher.forEach(row => {
      if (
        (row.permanent === 'No') ||
        (row.permanent === 'Si' &&
          new Date(row.start).getTime() - new Date().getTime() <= 6 * 24 * 60 * 60 * 1000 &&
          new Date(row.start).getTime() >= new Date().setHours(0, 0, 0, 0))
      ) {
        newRowsList.push(row);
      }
    });
  
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
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/add_calification', {
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
  }
  
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
    if(type==='client' && userAccount){
        fetchClasses();
    }
  }, [type,userAccount])

  useEffect(() => {
    if(isSmallScreen400 || isSmallScreen500) {
      setRowsPerPage(10);
    } else {
      setRowsPerPage(5)
    }
    if(isMobileScreen) {
      setMaxHeight('700px');
    } else {
      setMaxHeight('600px')
    }
  }, [isSmallScreen400, isSmallScreen500, isMobileScreen])

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
        if(data.type!='client'){
          navigate('/');
        }
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const visibleRows = React.useMemo(
    () =>
      [...newRows]
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
    [order, orderBy, page, rowsPerPage, newRows]
  );

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
                        <p className="fw-bold mb-0" style={{color: '#424242' }}>{formatDate(new Date(event.start))}</p>
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
                          left: isSmallScreen700 ? '88%' : '90%',
                        }}
                      >
                        <CloseIcon sx={{ color: '#F5F5F5' }} />
                      </button>
                      {(new Date(event.start).getTime() - new Date().getTime() <= 1 * 24 * 60 * 60 * 1000) ? (
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
      {type!='client' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
      <NewLeftBar />
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
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={(event) => handleRequestSort(event, 'name')}
                      >
                        Name
                        {orderBy === 'name' && (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        )}
                      </TableSortLabel>
                    </TableCell>
                    {!isSmallScreen500 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                        <TableSortLabel
                          active={orderBy === 'hour'}
                          direction={orderBy === 'hour' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'hour')}
                        >
                          Start time
                          {orderBy === 'hour' && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )}
                    {!isSmallScreen400 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                        <TableSortLabel
                          active={orderBy === 'start'}
                          direction={orderBy === 'start' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'start')}
                        >
                          Date
                          {orderBy === 'start' && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )}
                    {!isSmallScreen600 && (
                      <TableCell align="right" sx={{ borderBottom: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                        <TableSortLabel
                          active={orderBy === 'permanent'}
                          direction={orderBy === 'permanent' ? order : 'asc'}
                          onClick={(event) => handleRequestSort(event, 'permanent')}
                        >
                          Recurrent
                          {orderBy === 'permanent' && (
                            <Box component="span" sx={visuallyHidden}>
                              {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                          )}
                        </TableSortLabel>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.length===0 ? (
                      <TableRow>
                      <TableCell colSpan={isSmallScreen500 ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                          There are no booked classes
                      </TableCell>
                      </TableRow>
                  ) : (
                    <>
                      {visibleRows.map((row) => (
                          <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #424242' }}>
                          <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                              {row.name}
                          </TableCell>
                          {!isSmallScreen500 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{row.hour}</TableCell>
                          )}
                          {!isSmallScreen400 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>{formatDate(new Date(row.start))}</TableCell>
                          )}
                          {!isSmallScreen600 && (
                              <TableCell align="right" sx={{ borderBottom: '1px solid #424242', color: '#424242' }}>{row.permanent === 'Si' ? 'Yes' : 'No'}</TableCell>
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
                {isSmallScreen500 ? (
                  <TablePagination
                      rowsPerPageOptions={[10]}
                      component="div"
                      count={newRows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                  />
                  ) : (
                  <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={newRows.length}
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
      </>
      )}
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
