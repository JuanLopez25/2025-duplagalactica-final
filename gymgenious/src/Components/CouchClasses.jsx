import React, {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { QRCodeCanvas } from "qrcode.react";
import NewLeftBar from '../real_components/NewLeftBar'
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Searcher from '../real_components/searcher.jsx';
import fetchSalas from '../fetchs/fetchSalas.jsx'
import timeToMinutes from '../functions/TimeToMinutes.jsx'
import day from '../functions/DateToString.jsx'
import formatDate from '../functions/formatDate.jsx'
import ItemList from '../real_components/ItemList.jsx'
import fetchUser from '../fetchs/fetchUser.jsx'
import verifyToken from '../fetchs/verifyToken.jsx';
import Loader from '../real_components/loader.jsx';
import moment from 'moment';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import CustomTable from '../real_components/Table4columns.jsx';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';

function CouchClasses() {
  const [warningFetchingSalas,setWarningFetchingSalas] = useState(false)
  const [maxNum,setMaxNum] = useState(null);
  const [salas, setSalas] = useState([]);
  const [salaAssigned, setSala] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editClass, setEditClass] = useState(false);
  const [userMail,setUserMail] = useState(null)
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [errorCapacity,setErrorCapacity] = useState(false)
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [fetchedInventory,setFetchInventory] = useState([])
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
  const [fetchSala,setFetchSala] = useState('')
  const [fetchCapacity, setFetchCapacity] = useState('')
  const [errorForm, setErrorForm] = useState(false);
  const [itemData,setItemData] = useState([])
  const [salaInfo,setSalaInfo] = useState([])
  const [filterClasses, setFilterClasses] = useState('');
  const [totalClasses, setTotalClasses] = useState([]);
  const [openCheckList, setOpenCheckList] = useState(false);
  const [viewQualifications, setViewQualifications] = useState(false);
  const [viewInventory, setViewInventory] = useState(false)

  const handleViewQualifications = () => {
    setViewQualifications(!viewQualifications)
  }

  const handleViewInventory = () => {
    setViewInventory(!viewInventory)
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
          <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'40%'}}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>Assistance for "{selectedEvent.name}"</MDBTypography>
                    </div>
                    <div style={{justifyContent:'center',left:'23%',alignContent:'center',width:'60%',position:'relative'}}>
                      <QRCodeCanvas value={`http://localhost:3000/mark-attendance?token=${qrToken}`} size={256} />
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

  const hanldeCheckList = () => {
    setOpenCheckList(true);
  };

  useEffect(() => {
    if (userMail && (maxNum || fetchCapacity)) {
      fetchSalas(setOpenCircularProgress,setSalas,setWarningFetchingSalas,maxNum)
    }
  }, [userMail,maxNum,fetchCapacity]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleCloseCheckList = () => {
    setOpenCheckList(null);
  };

  const fetchInventory = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      
      try {
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_inventory`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los datos del inventario: ' + response.statusText);
        }
        const data = await response.json();
        
        const itemsWithQuantities = data.map((item) => {
          const matchingReservation = selectedEvent.reservations.find(
            (reservation) => reservation.item === item.id
          );
          return {
            ...item,
            cantidad: matchingReservation ? matchingReservation.cantidad : 0, 
            totalReservado: 0,
          };
        });

        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!response2.ok) {
          throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data2 = await response2.json();
        data2.forEach((clase) => {
          clase.reservations.forEach((objeto) => {
            const item = itemsWithQuantities.find((i) => i.id === objeto.item);
            if (item && clase.id!=selectedEvent.id) {
              item.totalReservado += objeto.cantidad;
            }
          });
        });
        setItemData(itemsWithQuantities);
      
      } catch (error) {
        console.error("Error:", error.message);
      }
      
    } catch (error) {
        console.error("Error fetching user:", error);
    }finally {
      setOpenCircularProgress(false)
    }
  };
  
  const handleEditClass = (selectedEvent) => {
    fetchInventory()
    setEditClass(!editClass);
    setFetchInventory(selectedEvent.reservations)
    setFetchId(selectedEvent.id)
    setFetchDateFin(selectedEvent.dateFin)
    setFetchDateInicio(selectedEvent.dateInicio)
    setFetchDay(selectedEvent.day)
    setFetchName(selectedEvent.name)
    setFetchHour(selectedEvent.hour)
    setFetchPermanent(selectedEvent.permanent)
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
    setErrorHour(false)
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
        const itemsReservados = [];
        itemData.forEach((item) => {
          if (item.cantidad > 0) {
            itemsReservados.push({ item: item.id, cantidad: item.cantidad });
          }
        });
        formData.append('reservations', JSON.stringify(itemsReservados));
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
    let matchedItems = itemData
    .map(item => {
      let matchedItem = fetchedInventory.find(invItem => invItem.item === item.id);
      if (matchedItem) {
        return {
          id: item.id,
          cantidad1: item.cantidad,
          cantidad2: matchedItem.cantidad
        };
      }
      return null; 
    })
    .filter(item => item !== null);
    let res = true;
    let allMatch = matchedItems.every((item)=>item.cantidad1==item.cantidad2);
    if (name==='' && hour === '' && hourFin === '' && date=== '' && salaAssigned==null && maxNum===null && permanent==='' && allMatch) {
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

  const saveClass = async (event) => {
    event.preventDefault(); 
    const salaInfoValida = await fetchSalaInfo(salaAssigned || fetchSala);
    if (salaInfoValida && validateForm()) {
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

  const fetchSalaInfo = async (sala) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return false;  
      }
      const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_salas`, {
          method: 'GET', 
          headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (!response.ok) {
          throw new Error('Error al obtener las rutinas: ' + response.statusText);
      }
      const data = await response.json();
      const dataFinal = data.filter(room => room.id == sala);
      
      console.log("data final", dataFinal);
      console.log("capacidad", (maxNum || fetchCapacity));
      if (dataFinal.length === 0) {
        console.error("No se encontró la sala.");
        setErrorCapacity(true);
        return false; 
      }
      setSalaInfo(dataFinal);
      const capacidadSala = dataFinal[0]?.capacidad || 0;
      if (parseInt(capacidadSala) < (maxNum || fetchCapacity)) {
        setErrorCapacity(true);
        return false;
      } else {
        setErrorCapacity(false);
        return true;
      }
    } catch (error) {
      console.error("Error fetching salas:", error);
      setWarningConnection(true);
      setTimeout(() => setWarningConnection(false), 3000);
      return false; 
    } finally {
      setOpenCircularProgress(false);
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
      const response5 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_inventory`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response5.ok) {
        throw new Error('Error al obtener los datos del inventario: ' + response5.statusText);
      }
      const data5 = await response5.json();
      const mapData5 = new Map();

      data5.forEach(item => {
        mapData5.set(item.id, { name: item.name, img: item.img }); 
      });

      const updatedDataMatches = calendarEvents.map(match => {
        const updatedReservations = match.reservations.map(reservation => {
          const matchedData = mapData5.get(reservation.item);
          return {
            cantidad: reservation.cantidad,
            item: reservation.item,
            name: matchedData?.name || null,  
            img: matchedData?.img || null,
          };
        });
        return {
          ...match,
          reservations: updatedReservations,
        };
      });

      const formattedRoutines = updatedDataMatches.map((routine) => {
        return {
            ...routine,
            startDisplay: formatDate(new Date(routine.start)), 
            dateInicioHora: new Date(new Date(routine.dateInicio).setHours(new Date(routine.dateInicio).getHours() + 3)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            recurrent: routine.permanent=='Si' ? 'Yes' : 'No'
        };
      });
      console.log("estas son las clases", formattedRoutines)
      setTotalClasses(formattedRoutines);
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

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail);
    }
  }, [userMail]);

  useEffect(() => {
    if(type==='coach'){
        fetchClasses();
    }
  }, [type])
  

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
                        <p className="fw-bold mb-0" style={{color: '#424242' }}>{event.startDisplay}</p>
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
                          {userMail && type==='coach' && event.reservations.length!==0? (
                              <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }} onClick={handleViewInventory}>Inventory reserves</MDBBtn>
                          ) : (
                            <MDBBtn outline color="dark" rounded size="sm" className="mx-1" style={{color: '#424242' }}>No inventory reserves</MDBBtn>
                          )}  
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
                        {new Date(event.start).getDate() == new Date().getDate() && event.BookedUsers.length>0? (
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
        <Searcher filteredValues={filterClasses} setFilterValues={setFilterClasses} isSmallScreen={isSmallScreen700} searchingParameter={'class name'}/>
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
        {newRows && (
              <CustomTable columnsToShow={['Name','Start time','Date','Recurrent','No classes']} data={newRows} handleSelectEvent={handleSelectEvent} vals={['name','dateInicioHora','startDisplay','recurrent']}/> 
        )}
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
                                    value={date || formatDate(new Date(selectedEvent.dateInicio))}
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
                        {itemData.length>0 && 
                            <ItemList data={itemData} setItemData={setItemData} />
                        }
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
                          {errorCapacity && (<p style={{color: 'red', margin: '0px'}}>The room is not big enough</p>)}
                        </div>
                        <button onClick={saveClass} style={{width: isSmallScreen700 ? '70%' : '30%'}} className='button_login'>Save changes</button>
                        <button onClick={handleEditClass} className='button_login' style={{width: isSmallScreen700 ? '70%' : '30%', marginTop: isSmallScreen700 ? '10px' : '', marginLeft: isSmallScreen700 ? '' : '10px'}}>Cancel</button>
                        
                </div>
            </div>
        )}
        </>
        )}
        {selectedEvent && (
          <ECommerce event={selectedEvent}/>
        )}
        {viewInventory && (
        <div className="Modal" onClick={handleViewInventory}>
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
                Items reserved
            </p>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between', marginRight: '0px'}}>
                <div className="input-small-container" style={{flex: 3}}>
                    <ul style={{maxHeight: '400px', overflowY: 'auto'}}>
                      {selectedEvent.reservations.map((cm) => (
                        <li style={{textOverflow: 'ellipsis', maxWidth: 'auto'}}>
                          {cm.name}
                        </li>
                      ))}
                    </ul>
                </div>
                <div className="input-small-container" style={{flex: 3}}>
                    <ul style={{maxHeight: '400px', overflowY: 'auto',listStyle:'none'}}>
                      {selectedEvent.reservations.map((cm) => (
                        <li style={{textOverflow: 'ellipsis', maxWidth: 'auto'}}>
                          {cm.cantidad}
                        </li>
                      ))}
                    </ul>
                </div>
            </div>
            <button onClick={handleViewInventory}>Close</button>
          </div>
        </div>
      )}
      {warningFetchingSalas ? (
          <div className='alert-container'>
            <div className='alert-content'>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit >
                  <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                    Error while fetching classes
                  </Alert>
                </Slide>
              </Box>
            </div>
          </div>
        ) : (
          null
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
