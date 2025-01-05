import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Box, useMediaQuery } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { QRCodeCanvas } from "qrcode.react";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
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
import Checkbox from '@mui/material/Checkbox';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

function CouchClasses() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [maxNum,setMaxNum] = useState(null);
  const [salas, setSalas] = useState([]);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [salaAssigned, setSala] = useState(null);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const [userAccount, setUser] = useState(null)
  const isSmallScreen400 = useMediaQuery('(max-width:400px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const [classes,setClasses]=useState([])
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [maxHeight, setMaxHeight] = useState('600px');
  const [type, setType] = useState(null);
  const [errorSala, setErrorSala] = useState(false);
  const [errorHour, setErrorHour] = useState(false);
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [newRows, setNewRows] = useState([]);

  const [fetchId,setFetchId] = useState('');
  const [fetchDateFin,setFetchDateFin]= useState('');
  const [fetchDateInicio,setFetchDateInicio]=useState('');
  const [fetchDay,setFetchDay]=useState('');
  const [fetchName,setFetchName]=useState('');
  const [fetchHour,setFetchHour]=useState('');
  const [fetchPermanent,setFetchPermanent]=useState('');
  const [fetchClass,setFetchClass]=useState({});
  const [fetchSala,setFetchSala] = useState('')
  const [fetchCapacity, setFetchCapacity] = useState('')
  const [failureErrors, setFailureErrors] = useState(false);
  const [errorForm, setErrorForm] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [openCheckList, setOpenCheckList] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(['1']);
  const [checked, setChecked] = useState(false);
  const [viewQualifications, setViewQualifications] = useState(false);

  const handleViewQualifications = () => {
    setViewQualifications(!viewQualifications)
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

  const EventQRCode = ({ selectedEvent}) => {
    const [qrToken, setQrToken] = useState(null);
    useEffect(() => {
      const fetchToken = async () => {
        try {
          const response = await fetch(`https://two025-duplagalactica-final.onrender.com/generate-token/${selectedEvent.id}/${selectedEvent.dateFin}/${selectedEvent.dateInicio}`);
          const data = await response.json();
          setQrToken(data.token);
        } catch (error) {
          console.error("Error al obtener el token:", error);
        }
      };
  
      fetchToken();
    }, [selectedEvent.id]);
  
    if (!qrToken) {
      return <div>Cargando token...</div>;
    }
  
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseCheckList}>
          <MDBContainer>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>Assistance for "{selectedEvent.name}"</MDBTypography>
                    </div>
                    <div style={{justifyContent:'center',left:'23%',alignContent:'center',width:'60%',position:'relative'}}>
                      <QRCodeCanvas value={`https://2025-duplagalactica-final.vercel.app//mark-attendance?token=${qrToken}`} size={256} />
                    </div>
                    <button 
                        onClick={handleCloseCheckList}
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
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  };
  

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const hanldeCheckList = () => {
    setOpenCheckList(true);
  };

  const closeCheckList = () => {
    setOpenCheckList(false);
  };

  const saveCheckList = async () => {
    setOpenCircularProgress(true)
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Token no disponible en localStorage');
      return;
    }
    const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_users`, {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
    });
    if (!response.ok) {
        throw new Error('Error al obtener las rutinas: ' + response.statusText);
    }
    const data = await response.json();
    const emailToUidMap = data.reduce((acc, user) => {
      acc[user.Mail] = user.uid;
      return acc;
    }, {});
    const allUsers = selectedEvent.BookedUsers.map(email => emailToUidMap[email] || email)
    const updatedSelectedUsers = selectedUsers.map(email => emailToUidMap[email] || email);
    if (selectedEvent.permanent=='Si') {
      const formData = new FormData();
      formData.append('usuarios', allUsers);
      formData.append('selectedEvent',selectedEvent.id);
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/update_class_use', {
          method: 'PUT', 
          headers: {
              'Authorization': `Bearer ${authToken}`
          },
          body: formData,
      });
      if (!response2.ok) {
          throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
      }
    }
    const formData3 = new FormData();
    formData3.append('usuarios', updatedSelectedUsers);
    formData3.append('selectedEvent',selectedEvent.id);
    const response3 = await fetch('https://two025-duplagalactica-final.onrender.com/add_missions', {
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData3,
    });
    if (!response3.ok) {
        throw new Error('Error al actualizar los datos de las misiones: ' + response3.statusText);
    }
    const formData4 = new FormData();
    formData4.append('selectedEvent',selectedEvent.id);
    formData4.append('fecha',formatDate(new Date(selectedEvent.start)))
    formData4.append('uid',userAccount.uid)
    const response4 = await fetch('https://two025-duplagalactica-final.onrender.com/add_assistance', {
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${authToken}`
        },
        body: formData4,
    });
    if (!response4.ok) {
        throw new Error('Error al actualizar los datos de la asistencia: ' + response4.statusText);
    }
    setTimeout(() => {
      setOpenCircularProgress(false);
    }, 2000);
    window.location.reload()
  }

  const handleOpenSearch = () => {
    setOpenSearch(true);
  };

  const handleCloseSearch = () => {
    setOpenSearch(false);
    setClasses(totalClasses);
  };

  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysOfWeek[date.getDay()];
  };

  function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (userMail && (maxNum || fetchCapacity)) {
      fetchSalas();
    }
  }, [userMail,maxNum,fetchCapacity]);
  
  const fetchSalas = async () => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_salas`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const data = await response.json();
        let dataFinal=[]
        if(maxNum!=null){
          dataFinal = data.filter((sala)=>parseInt(sala.capacidad)>=maxNum)
        } else {
          dataFinal = data.filter((sala)=>parseInt(sala.capacidad)>=fetchCapacity)
        }
        setSalas(dataFinal);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
  };
  
  function formatDateForInput(date) {
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
  const handleCloseCheckList = () => {
    setOpenCheckList(null);
  };
  const handleEditClass = (selectedEvent) => {
    setEditClass(!editClass);
    setFetchId(selectedEvent.id)
    setFetchDateFin(selectedEvent.dateFin)
    setFetchDateInicio(selectedEvent.dateInicio)
    setFetchDay(selectedEvent.day)
    setFetchName(selectedEvent.name)
    setFetchHour(selectedEvent.hour)
    setFetchPermanent(selectedEvent.permanent)
    setFetchClass(selectedEvent)
    setFetchSala(selectedEvent.sala)
    setFetchCapacity(selectedEvent.capacity)
    setHour('');
    setHourFin('');
    setPermanent('');
    setDate('');
    setName('');
    setMaxNum(null);
    setSala(null);
    setErrorForm(false);
    setErrorSala(false);
  } 


  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }


  const fetchModifyClassInformation = async () => {
    setOpenCircularProgress(true);
    setErrorSala(false);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }

        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!response2.ok) {
            throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data2 = (await response2.json()).filter((res)=> res.id!=fetchId);
        const isoDateString = date.toString() || fetchDateInicio.split('T')[0]; 

        const newPreviousDate = fetchDateInicio ? fetchDateInicio.split('T')[0] : null;
        const newPreviousDateFin = fetchDateFin ? fetchDateFin.split('T')[0] : null;
        const newPreviousHour = fetchDateInicio ? fetchDateInicio.split('T')[1].split('Z')[0] : "00:00:00";
        const newPreviousHourFin = fetchDateFin ? fetchDateFin.split('T')[1].split('Z')[0] : "00:00:00";

        const finalDateStart = date || newPreviousDate;
        const finalHourStart = hour || newPreviousHour;
        const finalDateEnd = date || newPreviousDateFin;
        const finalHourEnd = hourFin || newPreviousHourFin;

        const newClassStartTime = new Date(`${finalDateStart}T${finalHourStart}Z`);
        const newClassEndTime = new Date(`${finalDateEnd}T${finalHourEnd}Z`);
        const newClassStartTimeInMinutes = timeToMinutes(finalHourStart);
        const newClassEndTimeInMinutes = timeToMinutes(finalHourEnd);
        const conflictingClasses = data2.filter(classItem => 
          classItem.sala === (salaAssigned || fetchSala) &&
          classItem.day === day(isoDateString) 
        );
        if ((permanent || fetchPermanent) == "No") {
          const hasPermanentConflict = conflictingClasses.some(existingClass => 
            existingClass.permanent == "Si" && 
            newClassStartTime > new Date(existingClass.dateFin) &&
            newClassEndTime > new Date(existingClass.dateInicio) &&
            newClassEndTime > new Date(existingClass.dateFin) &&
            newClassStartTime > new Date(existingClass.dateInicio) &&
            newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
            newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5))
          );
          const hasNonPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTime < new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio)
          );
          if (hasNonPermanentConflict || hasPermanentConflict) {
              console.error('Conflicto de horario con clases existentes en esta sala.');
              setOpenCircularProgress(false);
              throw new Error('Error al crear la clase: Conflicto de horario con clases existentes en esta sala.');
          }
        } 
        else if ((permanent || fetchPermanent) == "Si") {
            const hasPastPermanentConflict = conflictingClasses.some(existingClass =>
                existingClass.permanent == "Si" &&
                newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
                newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5)) &&
                newClassStartTime.getFullYear()>= (new Date(existingClass.dateFin)).getFullYear() &&
                newClassEndTime.getFullYear()>= (new Date(existingClass.dateInicio)).getFullYear() &&
                String((newClassStartTime.getMonth() + 1)).padStart(2, '0')>= String((new Date(existingClass.dateFin).getMonth() + 1)).padStart(2, '0') &&                
                String((newClassEndTime.getMonth() + 1)).padStart(2, '0')>= String((new Date(existingClass.dateInicio).getMonth() + 1)).padStart(2, '0') &&
                String((newClassStartTime.getDate())).padStart(2, '0') >= String((new Date(existingClass.dateFin).getDate())).padStart(2, '0') && 
                String((newClassEndTime.getDate())).padStart(2, '0') >= String((new Date(existingClass.dateInicio).getDate())).padStart(2, '0')
            );

            const hasNonPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
              newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5)) &&
              newClassStartTime.getFullYear()<= (new Date(existingClass.dateFin)).getFullYear() &&
              newClassEndTime.getFullYear()<= (new Date(existingClass.dateInicio)).getFullYear() &&
              String((newClassStartTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateFin).getMonth() + 1)).padStart(2, '0') &&                
              String((newClassEndTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateInicio).getMonth() + 1)).padStart(2, '0') &&
              String((newClassStartTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateFin).getDate())).padStart(2, '0') && 
              String((newClassEndTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateInicio).getDate())).padStart(2, '0')
            );

            const hasPermanentConflict = conflictingClasses.some(existingClass =>
              newClassStartTime < new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio)
            );
            if (hasPastPermanentConflict || hasPermanentConflict || hasNonPermanentConflict) {
                console.error('Ya existe una clase permanente en esta sala para este horario.');
                setOpenCircularProgress(false);
                throw new Error('Error al crear la clase: Ya existe una clase permanente en esta sala para este horario.');
            }
        }
        

        const previousDate = fetchDateInicio ? fetchDateInicio.split('T')[0] : null;
        const previousDateFin = fetchDateFin ? fetchDateFin.split('T')[0] : null;

        const previousHour = fetchDateInicio ? fetchDateInicio.split('T')[1].split('Z')[0].slice(0, -7) : "00:00"; 
        const previousHourFin = fetchDateFin ? fetchDateFin.split('T')[1].split('Z')[0].slice(0, -7) : "00:00"; 

        const isoDateStringInicio = `${date || previousDate}T${hour || previousHour}:00.000Z`;
        const isoDateStringFin = `${date || previousDateFin}T${hourFin || previousHourFin}:00.000Z`;
        
        const formData = new FormData();
        formData.append('cid', fetchId);
        formData.append('DateFin', isoDateStringFin);
        formData.append('DateInicio', isoDateStringInicio);
        formData.append('Day', day(date.toString()) || fetchDay);
        formData.append('Name',name || fetchName);
        formData.append('Hour', hour || fetchHour);
        formData.append('Permanent',permanent || fetchPermanent);
        formData.append('sala', salaAssigned || fetchSala);
        formData.append('capacity', maxNum || fetchCapacity);
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_class_info', {
            method: 'PUT', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Error al actualizar los datos del usuario: ' + response.statusText);
        }
        setTimeout(() => {
          setOpenCircularProgress(false);
        }, 2000);
        window.location.reload()
    } catch (error) {
        console.error("Error updating user:", error);
        setOpenCircularProgress(false);
        setErrorSala(true);
    }
};
  const validateForm = () => {
    let res = true;
    if (name==='' && hour === '' && hourFin === '' && date=== '' && salaAssigned===null && maxNum===null && permanent==='') {
        setErrorForm(true);
        res = false;
    } else {
        setErrorForm(false);
    }

    const format= "HH:mm";
    const hourFinForm = hourFin || fetchDateFin.split('T')[1].split(':').slice(0, 2).join(':');
    const hourForm = hour || fetchHour;
    const realHourEnd = moment(hourFinForm, format).subtract(30, 'minutes').format(format);
    if(moment(realHourEnd, format).isBefore(moment(hourForm, format)) && hourFinForm!=''){
      setErrorHour(true);
      res = false;
    } else {
      setErrorHour(false);
    }
    return res;
  }

  const saveClass = (event) => {
    if(validateForm()){
      event.preventDefault(); 
      fetchModifyClassInformation();
    }
  };

  const handleDeleteClass = async (event) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/delete_class', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ event: event,mail:userMail })
      });
      if (!response.ok) {
        throw new Error('Error al actualizar la clase: ' + response.statusText);
      }
      await fetchClasses();
      setOpenCircularProgress(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      handleCloseModal();
      setTimeout(() => {
        setWarningConnection(false);
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
      //console.log("primero response",response.json())
      const data = await response.json();
      const filteredClasses = data.filter(event => event.owner == userMail);
      if(filteredClasses.length===0){
        setOpenCircularProgress(false)
        return;
      }
      const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_salas');
      if (!response2.ok) {
        throw new Error('Error al obtener las salas: ' + response2.statusText);
      }
      const salas = await response2.json();
      //console.log("segundo response",response2.json())
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
        const comments = aggregatedComments.find(comment => comment.cid === clase.id) || { averageCalification: 0, commentaries: [] };
        return {
          ...clase,
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
      const argentinaDateOptions = { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' };
      const response4 = await fetch('https://two025-duplagalactica-final.onrender.com/get_assistance', {
        method: 'GET'
      });
      if (!response4.ok) {
        throw new Error('Error al obtener las salas: ' + response4.statusText);
      }
      const assistance_references = await response4.json();
      console.log(calendarEvents)
      const dataMatches = calendarEvents.map(evento => {
        const fechaEvento = new Date(new Date(evento.start).setHours(new Date(evento.start).getHours() - 3));
        const comment = assistance_references.find(c => 
          (c.cid === evento.id) && 
          (fechaEvento.toISOString().split('T')[0] === new Date(c.date).toISOString().split('T')[0])
        );
        return {
          ...evento,
          fecha: comment ? comment.date : null,
        };
      });
      
      setClasses(dataMatches);
      setTotalClasses(dataMatches);
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
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token);
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser();
    }
}, [userMail]);


  useEffect(() => {
    if(type==='coach'){
        fetchClasses();
    }
  }, [type])

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
        setUser(data)
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const compararfechaHoy = (fecha) => {
    const fechaGuardada = new Date(fecha);
    const fechaActual = new Date();
    const diaGuardado = fechaGuardada.getDate();
    const mesGuardado = fechaGuardada.getMonth(); 
    const anioGuardado = fechaGuardada.getFullYear();
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth();
    const anioActual = fechaActual.getFullYear();
    const coincide = (diaGuardado === diaActual) && (mesGuardado === mesActual) && (anioGuardado === anioActual);
    return coincide
  }

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
                          {/* <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.averageCalification}</MDBBtn>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>{event.commentaries}</MDBBtn> */}
                          {userMail && type==='coach' && event.averageCalification!==0 && event.commentaries?.length!==0 ? (
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
                      <MDBBtn
                          style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                          rounded
                          block
                          size="lg"
                          onClick={()=>handleEditClass(event)}
                        >
                          Edit class
                        </MDBBtn>
                        {event.fecha==null && new Date(event.start).getDate() == new Date().getDate() && event.BookedUsers.length>0? (
                        <MDBBtn
                          style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                          rounded
                          block
                          size="lg"
                          onClick={()=>hanldeCheckList(event)}
                        >
                          Check list
                        </MDBBtn>):
                        (<></>)}
                        <MDBBtn
                          style={{ backgroundColor: '#48CFCB', color: 'white', width: '70%', left: '15%' }} 
                          rounded
                          block
                          size="lg"
                          onClick={()=>handleDeleteClass(event.id)}
                        >
                          Delete class
                        </MDBBtn>
                      {/* <button style={{marginLeft:'10px'}} onClick={()=>handleEditClass(selectedEvent)}>Edit class</button>
                      <button style={{marginLeft:'10px'}} onClick={() => handleDeleteClass(selectedEvent.id)}>Delete class</button> */}
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
        {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <Loader></Loader>
            </Backdrop>
        ) : (
          <>
        <NewLeftBar/>
        <div className='input-container' style={{marginLeft: isSmallScreen700 ? '60px' : '50px', width: isSmallScreen700 ? '50%' : '30%', position: 'absolute', top: '0.5%'}}>
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
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
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
                                    {!isSmallScreen500 && (
                                    <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold', color: '#424242' }}>
                                        <TableSortLabel
                                        active={orderBy === 'hour'}
                                        direction={orderBy === 'hour' ? order : 'asc'}
                                        onClick={(event) => handleRequestSort(event, 'hour')}
                                        >
                                        Start time
                                        {orderBy === 'hour' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
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
                                        {orderBy === 'start' ? (
                                            <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
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
                                        {orderBy === 'permanent' ? (
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
                              <TableCell colSpan={isSmallScreen500 ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                  There are no created classes
                              </TableCell>
                              </TableRow>
                            ) : (
                              <>
                                {visibleRows.map((row) => (
                                    <>
                                    {row.fecha==null && compararfechaHoy(row.start) && row.BookedUsers.length>0 ? (
                                      <>
                                      <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #424242' }}>
                                      <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',backgroundColor:'#8ecae6',borderRight: '1px solid #424242', color:'black', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                          {row.name}
                                      </TableCell>
                                      {!isSmallScreen500 && (
                                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242',backgroundColor:'#8ecae6', borderRight: '1px solid #424242', color: 'black' }}>{row.hour}</TableCell>
                                      )}
                                      {!isSmallScreen400 && (
                                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242',backgroundColor:'#8ecae6', borderRight: '1px solid #424242', color: 'black' }}>{formatDate(new Date(row.start))}</TableCell>
                                      )}
                                      {!isSmallScreen600 && (
                                          <TableCell align="right" sx={{ borderBottom: '1px solid #424242',backgroundColor:'#8ecae6', color: 'black' }}>{row.permanent === 'Si' ? 'Yes' : 'No'}</TableCell>
                                      )}
                                      </TableRow>
                                      </> ) : 
                                      (<>
                                      <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer', borderBottom: '1px solid #424242' }}>
                                      <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242',borderRight: '1px solid #424242', color:'#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
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
                                      </>)
                                    }
                                    </>
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
                {openCheckList && (
                  <div className="Modal" style={{zIndex:'1001'}}>
                  <EventQRCode selectedEvent={selectedEvent}/>
                  </div>
                )}
                {editClass && (
                    <div className="Modal" style={{zIndex:'1001'}}>
                        <div className="Modal-Content-class-creation" onClick={(e) => e.stopPropagation()}>
                            <h2>Class details</h2>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container">
                                        <label htmlFor="hour" style={{color:'#14213D'}}>Start time:</label>
                                        <input 
                                        type='time'
                                        id="hour" 
                                        name="hour"
                                        value={hour || fetchHour} 
                                        onChange={(e) => setHour(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="hourFin" style={{color:'#14213D'}}>End time:</label>
                                        <input 
                                            id="hourFin"
                                            type='time'
                                            name="hourFin" 
                                            value={hourFin || selectedEvent.dateFin.split('T')[1].split(':').slice(0, 2).join(':')} 
                                            onChange={(e) => setHourFin(e.target.value)}
                                        />
                                        {errorHour && (<p style={{color: 'red', margin: '0px'}}>30 minutes at least</p>)}
                                    </div>
                                    <div className="input-small-container">
                                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                                        <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={fetchName}/>
                                    </div>
                                </div>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                    <div className="input-small-container" style={{width:"100%"}}>
                                        <label htmlFor="permanent" style={{color:'#14213D'}}>Recurrent:</label>
                                          <select
                                            id="permanent"
                                            name="permanent"
                                            value={permanent || fetchPermanent}
                                            onChange={(e) => setPermanent(e.target.value)}
                                          >
                                            <option value="Si">Yes</option>
                                            <option value="No">No</option>
                                          </select>
                                    </div>
                                    <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                                        <label htmlFor="date" style={{color:'#14213D'}}>Date:</label>
                                        <input 
                                            type='date'
                                            id='date'
                                            name='date'
                                            value={date || formatDateForInput(new Date(selectedEvent.dateInicio))}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                <div className="input-small-container">
                                      <label htmlFor="salaAssigned" style={{ color: '#14213D' }}>Gymroom:</label>
                                      <select
                                          id="salaAssigned"
                                          name="salaAssigned"
                                          value={salaAssigned || selectedEvent.sala}
                                          onChange={(e) => setSala(e.target.value)}
                                          style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                                      >
                                          {salas.map((sala) => (
                                              <option style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} key={sala.id} value={sala.id}>
                                                  {sala.nombre.length > 50 ? `${sala.nombre.substring(0, 50)}...` : sala.nombre}
                                              </option>
                                          ))}
                                      </select>
                                      {errorSala && (<p style={{color: 'red', margin: '0px'}}>Room no available</p>)}
                                  </div>
                                </div>
                                <div className="input-small-container" style={{ flex: 3, textAlign: 'left' }}>
                                  <label htmlFor="maxNum" style={{color:'#14213D'}}>Participants:</label>
                                  <input
                                    type="number" 
                                    id="maxNum" 
                                    name="maxNum"
                                    min='1'
                                    max='500'
                                    step='1'
                                    value={maxNum || fetchCapacity} 
                                    onChange={(e) => setMaxNum(e.target.value)}
                                  />
                                  {errorForm && (<p style={{color: 'red', margin: '0px'}}>There are no changes</p>)}
                                </div>
                                <button onClick={saveClass} style={{width: isSmallScreen700 ? '70%' : '30%'}} className='button_login'>Save changes</button>
                                <button onClick={handleEditClass} className='button_login' style={{width: isSmallScreen700 ? '70%' : '30%', marginTop: isSmallScreen700 ? '10px' : '', marginLeft: isSmallScreen700 ? '' : '10px'}}>Cancel</button>
                                
                        </div>
                    </div>
                )}
            </Box>
        </div>
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
    </div>
    
  );
}

export default CouchClasses;
