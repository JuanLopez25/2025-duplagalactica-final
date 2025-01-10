import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import moment from 'moment'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Popper from '@mui/material/Popper';
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';
import Loader from '../real_components/loader.jsx'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';













export default function CreateClass() {
  const [hour, setHour] = useState('');
  const [hourFin, setHourFin] = useState('');
  const [permanent, setPermanent] = useState('');
  const [date, setDate] = useState('');
  const [salas, setSalas] = useState([]);
  const [showSalas, setShowSalas] = useState(false);
  const [warningFetchingRoutines, setWarningFetchingRoutines] = useState(false);
  const [salaAssigned, setSala] = useState(null); 
  const [name, setName] = useState('');
  const [maxNum,setMaxNum] = useState(1);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState('')
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureErrors, setFailureErrors] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [type, setType] = useState(null);
  const [maxWidthImg, setMaxWidthImg] = useState('0px');
  const [errorSala1, setErrorSala1] = useState(false);
  const [errorSala2, setErrorSala2] = useState(false);
  const [errorSala3, setErrorSala3] = useState(false);
  const [errorSala4, setErrorSala4] = useState(false); 
  const [validating,setValidating] = useState(false)
  const [errorSalas, setErrorSalas] = useState(false);
  const [errorStartTime, setErrorStartTime] = useState(false);
  const [errorEndTime, setErrorEndTime] = useState(false);
  const [errorEndTime30, setErrorEndTime30] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorRecurrent, setErrorRecurrent] = useState(false);
  const [errorDate, setErrorDate] = useState(false);
  const [errorDateStart, setErrorDateStart] = useState(false);
  const [salaNoDisponible, setSalaNoDisponible] = useState(['1'])
  const [itemData,setItemData] = useState([])
  const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado','Domingo'];
    return daysOfWeek[date.getDay()];
  };
  const ItemList = () => {
    const incrementQuantity = (itemName) => {
      setItemData((prevItems) =>
        prevItems.map((item) =>
          item.name === itemName
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    };
  
    const decrementQuantity = (itemName) => {
      setItemData((prevItems) =>
        prevItems.map((item) =>
          item.name === itemName
            ? { ...item, cantidad: Math.max(item.cantidad - 1, 0) }
            : item
        )
      );
    };
    return (
      <div style={{ width: "100%", margin: "auto"}}>
        <ul style={{ listStyleType: "none", padding: 0,backgroundColor:'white' }}>
          {itemData.map((item) => (
            <li
              key={item.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                color:'#424242'
              }}
            >
              <span>{item.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => decrementQuantity(item.name)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: 'none',
                    backgroundColor: 'white',
                    color:'#424242'
                  }}
                >
                  -
                </button>
                <span style={{ fontSize: "16px", minWidth: "20px", textAlign: "center",color:'#424242' }}>
                  {item.cantidad}
                </span>
                <button
                  onClick={() => incrementQuantity(item.name)}
                  style={{
                    padding: "5px 10px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: 'none',
                    backgroundColor: 'white',
                    color:'#424242'
                  }}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  const ComponenteBotonShowGymRoom = () => {
    return (
      <div className="grid-container">
        <BotonShowGymRoom>Show gymroom</BotonShowGymRoom>
      </div>
    );
  };
  
  const validateSalas = async () => {
    setValidating(true)
    setOpenCircularProgress(true);
    setErrorSalas(false);
    try {
        const salasError = []
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!response2.ok) {
            throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data = await response2.json();
        const isoDateString = date; 
        const newClassStartTime = new Date(`${date}T${hour}:00Z`);
        const newClassEndTime = new Date(`${date}T${hourFin}:00Z`);
        const newClassStartTimeInMinutes = timeToMinutes(hour);
        const newClassEndTimeInMinutes = timeToMinutes(hourFin);
        const conflictingClasses = data.filter(classItem => 
            classItem.day === day(isoDateString) 
        );
        if (permanent == "No") {
          const hasPermanentConflict = conflictingClasses.filter(existingClass => 
              existingClass.permanent == "Si" && 
              newClassStartTime > new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio) &&
              newClassEndTime > new Date(existingClass.dateFin) &&
              newClassStartTime > new Date(existingClass.dateInicio) &&
              newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
              newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5))
          );
          const hasNonPermanentConflict = conflictingClasses.filter(existingClass =>
              newClassStartTime < new Date(existingClass.dateFin) &&
              newClassEndTime > new Date(existingClass.dateInicio)
          );
          hasNonPermanentConflict.forEach(clas => salasError.push(clas.sala))
          hasPermanentConflict.forEach(clas => salasError.push(clas.sala))
          
      } 
      else if (permanent == "Si") {
          const hasPastPermanentConflict = conflictingClasses.filter(existingClass =>
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

          const hasNonPermanentConflict = conflictingClasses.filter(existingClass =>
            newClassStartTimeInMinutes < timeToMinutes(existingClass.dateFin.split('T')[1].substring(0, 5)) &&
            newClassEndTimeInMinutes > timeToMinutes(existingClass.dateInicio.split('T')[1].substring(0, 5)) &&
            newClassStartTime.getFullYear()<= (new Date(existingClass.dateFin)).getFullYear() &&
            newClassEndTime.getFullYear()<= (new Date(existingClass.dateInicio)).getFullYear() &&
            String((newClassStartTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateFin).getMonth() + 1)).padStart(2, '0') &&                
            String((newClassEndTime.getMonth() + 1)).padStart(2, '0')<= String((new Date(existingClass.dateInicio).getMonth() + 1)).padStart(2, '0') &&
            String((newClassStartTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateFin).getDate())).padStart(2, '0') && 
            String((newClassEndTime.getDate())).padStart(2, '0') <= String((new Date(existingClass.dateInicio).getDate())).padStart(2, '0')
          );

          const hasPermanentConflict = conflictingClasses.filter(existingClass =>
            newClassStartTime < new Date(existingClass.dateFin) &&
            newClassEndTime > new Date(existingClass.dateInicio)
          );
          hasNonPermanentConflict.forEach(clas => salasError.push(clas.sala))
          hasPermanentConflict.forEach(clas => salasError.push(clas.sala))
      }
      setSalaNoDisponible(salasError)
      setValidating(false)
    } catch (error) {
        console.error("Error al crear la clase:", error);
        if(salaAssigned==='PmQ2RZJpDXjBetqThVna'){
          setErrorSala1(true);
        } else if(salaAssigned==='cuyAhMJE8Mz31eL12aPO') {
          setErrorSala2(true);
        } else if(salaAssigned==='jxYcsGUYhW6pVnYmjK8H') {
          setErrorSala3(true);
        } else if(salaAssigned==='waA7dE83alk1HXZvlbyK') {
          setErrorSala4(true);
        }
        setOpenCircularProgress(false);
    }
  };


  const BotonShowGymRoom = ({ children, ...rest }) => {
    return (
      <button {...rest} className="draw-outline-button" onClick={handleViewRooms}>
        <span>{children}</span>
        <span className="top" />
        <span className="right" />
        <span className="bottom" />
        <span className="left" />
    </button>
    );
  };

  const ComponenteCreateClass = () => {
    return (
      <>
      {isSmallScreen ? (
          <div className="grid-container">
            <button onClick={handleCreateClass} className="draw-outline-button-small">Create class</button>
          </div>
        
      ) : (
        
          <div className="grid-container">
            <CreateClass>Create class</CreateClass>
          </div>
        
      )}
      </>
    );
  };
  
  const CreateClass = ({ children, ...rest }) => {
    return (
      <button {...rest} className="draw-outline-button" onClick={handleCreateClass}>
        <span>{children}</span>
        <span className="top" />
        <span className="right" />
        <span className="bottom" />
        <span className="left" />
    </button>
    );
  };

  const validateForm = () => {
      let errors = [];
      const format= "HH:mm";
      const realHourEnd = moment(hourFin, format).subtract(30, 'minutes').format(format);
      if(moment(realHourEnd, format).isBefore(moment(hour, format)) && hourFin!=''){
        errors.push('Class must last at least 30 minutes.');
        setErrorEndTime30(true);
      } else {
        setErrorEndTime30(false);
      }

      if(hour===''){
        errors.push('Please enter both the start and end times.');
        setErrorStartTime(true);
      } else {
        setErrorStartTime(false);
      }

      if(hourFin===''){
        errors.push('Please enter both the start and end times.');
        setErrorEndTime(true);
      } else {
        setErrorEndTime(false);
      }

      if (name === '') {
          errors.push('Please enter an exercise name.');
          setErrorName(true);
      } else {
        setErrorName(false);
      }

      if(permanent===''){
        errors.push('Please enter if the class is recurring or not.');
        setErrorRecurrent(true);
      } else {
        setErrorRecurrent(false);
      }

      if(date===''){
        errors.push('Please enter a date.');
        setErrorDate(true);
      } else {
        setErrorDate(false);
      }

      let [hourss, minutes] = hour.split(':');
      let [year, month, dayy] = date.split('-');
      let dateStart = new Date(parseInt(year), parseInt(month)-1, parseInt(dayy));
      dateStart.setHours(parseInt(hourss), parseInt(minutes));
      let today = new Date();
      console.log(dateStart)
      if(dateStart<today){
        errors.push('Cannot create classes in the past');
        setErrorDateStart(true);
      } else {
        setErrorDateStart(false);
      }

      setErrors(errors);
      return errors.length === 0;
  }
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  const handleCreateClass = async () => {
    if(validateForm()) {
      setOpenCircularProgress(true);
      setErrorSalas(false);
      try {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
          }
          if(salaAssigned===null){
            throw new Error('Select a room');
          }
          const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
          if (!response2.ok) {
              throw new Error('Error al obtener las clases: ' + response2.statusText);
          }
          const data = await response2.json();
          const isoDateString = date; 
          const newClassStartTime = new Date(`${date}T${hour}:00Z`);
          const newClassEndTime = new Date(`${date}T${hourFin}:00Z`);
          const newClassStartTimeInMinutes = timeToMinutes(hour);
          const newClassEndTimeInMinutes = timeToMinutes(hourFin);
          const conflictingClasses = data.filter(classItem => 
              classItem.sala === salaAssigned &&
              classItem.day === day(isoDateString) 
          );
          if (permanent == "No") {
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
        else if (permanent == "Si") {
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

          const newClass = {
              name: name,
              dateInicio: newClassStartTime.toISOString(),
              dateFin: newClassEndTime.toISOString(),
              hour: hour,
              day: day(isoDateString),
              permanent: permanent,
              owner: userMail,
              capacity: maxNum,
              BookedUsers: [],
              sala: salaAssigned
          };

          const response = await fetch('https://two025-duplagalactica-final.onrender.com/create_class', {
          //const response = await fetch('http://127.0.0.1:5000/create_class', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
              },
              body: JSON.stringify(newClass),
          });

          if (!response.ok) {
              throw new Error('Error al crear la clase');
          }

          setOpenCircularProgress(false);
          setSuccess(true);
          setTimeout(() => {
              setSuccess(false);
              navigate(`/?mail=${userMail}`, { state: { message: 'block' } });
          }, 3000);
      } catch (error) {
          console.error("Error al crear la clase:", error);
          if(salaAssigned==='PmQ2RZJpDXjBetqThVna'){
            setErrorSala1(true);
          } else if(salaAssigned==='cuyAhMJE8Mz31eL12aPO') {
            setErrorSala2(true);
          } else if(salaAssigned==='jxYcsGUYhW6pVnYmjK8H') {
            setErrorSala3(true);
          } else if(salaAssigned==='waA7dE83alk1HXZvlbyK') {
            setErrorSala4(true);
          }
          if(salaAssigned===null){
            setErrorSalas(true);
          }
          setOpenCircularProgress(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateClass();
  };

  const handleComeBack = (e) => {
    setShowSalas(false);
    setSala(null);
  };

  const handleSelectSala = (sala) => {
    if(sala.opacity===1) {
      setSala(sala.id);
      setErrorSala1(false);
      setErrorSala2(false);
      setErrorSala3(false);
      setErrorSala4(false);
    }
  }

  const handleViewRooms = () => {
    console.log(itemData)
    if(validateForm()){
      setSalaNoDisponible([])
      validateSalas()
      setTimeout(() => {
        if( !validating ){
          setShowSalas(true);
          fetchSalas();
        }
        setOpenCircularProgress(false)
      }, 3000);
    }
  };

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
        const dataFinal = data.map(room => {
          return {
              ...room,
              opacity: parseInt(room.capacidad) >= maxNum ? 1 : 0.5
          };
      });
        setSalas(dataFinal);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
  };

  const verifyToken = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setErrorToken(true);
        setTimeout(() => {
          setErrorToken(false);
        }, 3000);
        throw error;
    }
  };



  const fetchInventory = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch(`http://127.0.0.1:5000/get_inventory`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        const itemsWithQuantities = data.map((item) => ({ ...item, cantidad: 0 }));
        setItemData(itemsWithQuantities)
        console.log("data de inventario",data)
    } catch (error) {
        console.error("Error fetching user:", error);
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
    if(type==='coach' && userMail!=null){
        fetchInventory();
    }
  }, [type])

  useEffect(() => {
    if (isSmallScreen) {
      setMaxWidthImg('100%')
    } else {
      setMaxWidthImg('200px')
    }
  }, [isSmallScreen]);

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
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openHourRequirements, setOpenHourRequirements] = useState(false);
  const handleOpenHourRequirements = (event) => {
    if (openHourRequirements) {
        setAnchorEl(null); 
    } else {
        setAnchorEl(event.currentTarget);
    }
    setOpenHourRequirements(!openHourRequirements);
};
  const id = 'simple-popper';

  const handleCloseHourRequirements = () => {
    setOpenHourRequirements(false);
  }



  



  return (
    <div className='full-screen-image-2'>
      {!showSalas ? (
      <>
      {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <LeftBar/>
            <div className='class-creation-container'>
              <div className='class-creation-content'>
                <h2 style={{color:'#424242'}}>Create class</h2>
                  {!isSmallScreen ? (
                    <>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container">
                          <label htmlFor="name" style={{color:'#424242'}}>Name:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                          />
                           {errorName && (<p style={{color: 'red', margin: '0px'}}>Enter a name</p>)}
                        </div>
                        <div className="input-small-container" style={{width:"100%", marginBottom: '0px'}}>
                            <label htmlFor="permanent" style={{color:'#424242'}}>Recurrent:</label>
                            <select
                              onClick={handleCloseHourRequirements}
                              id="permanent" 
                              name="permanent" 
                              value={permanent} 
                              onChange={(e) => setPermanent(e.target.value)} 
                            >
                              <option value="" >Select</option>
                              <option value="Si">Yes</option>
                              <option value="No">No</option>
                            </select>
                            {errorRecurrent && (<p style={{color: 'red', margin: '0px'}}>Select a recurrent value</p>)}
                          </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{marginBottom: '0px'}}>
                          <label htmlFor="hour" style={{color:'#424242'}}>Start time:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="time" 
                            id="hour" 
                            name="hour" 
                            value={hour} 
                            onChange={(e) => setHour(e.target.value)} 
                          />
                          {errorStartTime && (<p style={{color: 'red', margin: '0px'}}>Enter a start time</p>)}
                        </div>
                        <div className="input-small-container" style={{marginBottom: '0px'}}>
                          <label htmlFor="hour" style={{color:'#424242'}}>End time:</label>
                          <input
                            onClick={handleOpenHourRequirements}
                            type="time" 
                            id="hourFin" 
                            name="hourFin" 
                            value={hourFin} 
                            onChange={(e) => setHourFin(e.target.value)} 
                          />
                          <Popper id={id} open={openHourRequirements} anchorEl={anchorEl}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenHourRequirements}>
                                <p>Class must last at least 30 minutes</p>
                            </Box>
                          </Popper>
                          {errorEndTime30 && (<p style={{color: 'red', margin: '0px'}}>Class must last at least 30 minutes</p>)}
                          {errorEndTime && (<p style={{color: 'red', margin: '0px'}}>Enter an end time</p>)}
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left', marginBottom: '0px' }}>
                            <label htmlFor="date" style={{color:'#424242'}}>Date:</label>
                            <input
                              onClick={handleCloseHourRequirements}
                              type="date" 
                              id="date" 
                              name="date" 
                              value={date} 
                              onChange={(e) => setDate(e.target.value)} 
                            />
                            {errorDate && (<p style={{color: 'red', margin: '0px'}}>Select a date</p>)}
                            {errorDateStart && (<p style={{color: 'red', margin: '0px'}}>Cannot create classes in the past</p>)}
                          </div>
                          <div className="input-small-container" style={{ flex: 3, textAlign: 'left', marginBottom: '0px' }}>
                          <label htmlFor="maxNum" style={{color:'#424242'}}>Participants:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="number" 
                            id="maxNum" 
                            name="maxNum"
                            min='1'
                            max='500'
                            step='1'
                            value={maxNum} 
                            onChange={(e) => setMaxNum(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container">
                          <ItemList/>
                        </div>
                      </div>
                        <ComponenteBotonShowGymRoom/>
                    </>
                  ) : (
                    <>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{marginBottom: '0px'}}>
                          <label htmlFor="hour" style={{color:'#424242'}}>Start time:</label>
                          <input
                            style={{marginBottom: '0px'}}
                            onClick={handleCloseHourRequirements}
                            type="time" 
                            id="hour" 
                            name="hour" 
                            value={hour} 
                            onChange={(e) => setHour(e.target.value)} 
                          />
                          {errorStartTime && (<p style={{color: 'red', margin: '0px'}}>Enter a start time</p>)}
                        </div>
                        <div className="input-small-container" style={{marginBottom: '0px'}}>
                          <label htmlFor="hour" style={{color:'#424242'}}>End time:</label>
                          <input
                            onClick={handleOpenHourRequirements}
                            type="time" 
                            id="hourFin" 
                            name="hourFin" 
                            value={hourFin} 
                            onChange={(e) => setHourFin(e.target.value)} 
                          />
                          <Popper id={id} open={openHourRequirements} anchorEl={anchorEl}>
                            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }} onClick={handleOpenHourRequirements}>
                                <p>Class must last at least 30 minutes</p>
                            </Box>
                          </Popper>
                          {errorEndTime30 && (<p style={{color: 'red', margin: '0px'}}>Class must last at least 30 minutes</p>)}
                          {errorEndTime && (<p style={{color: 'red', margin: '0px'}}>Enter an end time</p>)}
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{marginBottom: '0px'}}>
                            <label htmlFor="name" style={{color:'#424242'}}>Name:</label>
                            <input
                              onClick={handleCloseHourRequirements}
                              type="text" 
                              id="name" 
                              name="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                            />
                            {errorName && (<p style={{color: 'red', margin: '0px'}}>Enter a name</p>)}
                          </div>
                        <div className="input-small-container" style={{width:"100%", marginBottom: '0px'}}>
                          <label htmlFor="permanent" style={{color:'#424242'}}>Recurrent:</label>
                          <select
                            onClick={handleCloseHourRequirements}
                            id="permanent" 
                            name="permanent" 
                            value={permanent} 
                            onChange={(e) => setPermanent(e.target.value)} 
                          >
                            <option value="" >Select</option>
                            <option value="Si">Yes</option>
                            <option value="No">No</option>
                          </select>
                          {errorRecurrent && (<p style={{color: 'red', margin: '0px'}}>Select a recurrent value</p>)}
                          
                        </div>
                      </div>
                      <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left', marginBottom: '0px' }}>
                          <label htmlFor="maxNum" style={{color:'#424242'}}>Participants:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="number" 
                            id="maxNum" 
                            name="maxNum"
                            min='1'
                            max='500'
                            step='1'
                            value={maxNum} 
                            onChange={(e) => setMaxNum(e.target.value)} 
                          />
                        </div>
                        <div className="input-small-container" style={{ flex: 3, textAlign: 'left', marginBottom: '0px'}}>
                          <label htmlFor="date" style={{color:'#424242'}}>Date:</label>
                          <input
                            onClick={handleCloseHourRequirements}
                            type="date" 
                            id="date" 
                            name="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                          />
                          {errorDate && (<p style={{color: 'red', margin: '0px'}}>Select a date</p>)}
                        </div>   
                      </div>
                      <button className='button_login' style={{width: '70%'}} onClick={handleViewRooms}>
                    Show gymrooms
                  </button>
                    </>
                  )}
                  
              </div>
            </div>
          </>
      )}
      </>
      ) : (
        <>
          <LeftBar/>
            <div className='class-creation-rooms-container'>
              <div className='class-creation-content' style={{paddingTop: '10px'}}>
              <button 
                onClick={handleComeBack} 
                className="custom-button-go-back-managing"
              >
                <KeyboardBackspaceIcon sx={{ color: '#F5F5F5' }} />
              </button>
                <h2 style={{color:'#424242'}}>Create class</h2>
                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                  { salaNoDisponible.includes(salas[0]?.id) ? (<><div  className={salaAssigned==salas[0]?.id && salas[0]?.opacity===1 ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center',borderRadius:'10px' ,backgroundColor: salaAssigned==salas[0]?.id && salas[0]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img 
                      src={`${process.env.PUBLIC_URL}/salon_pequenio.jpeg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity:0.2,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>Not available</p>
                    {errorSala1 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div></>) : (
                  <div onClick={() => handleSelectSala(salas[0])} className={salaAssigned==salas[0]?.id && salas[0]?.opacity===1 ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center',borderRadius:'10px' ,backgroundColor: salaAssigned==salas[0]?.id && salas[0]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img 
                      src={`${process.env.PUBLIC_URL}/salon_pequenio.jpeg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity: salas[0]?.opacity,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>{salas[0]?.nombre} ({salas[0]?.capacidad})</p>
                    {errorSala1 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div>)}
                  { salaNoDisponible.includes(salas[1]?.id) ? (<><div className={salaAssigned==salas[1]?.id && salas[1] ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center', borderRadius:'10px',backgroundColor: salaAssigned==salas[1]?.id && salas[1]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img 
                      src={`${process.env.PUBLIC_URL}/gimnasio.jpeg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity: 0.2,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>Not available</p>
                    {errorSala2 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div></>) : (
                  <div onClick={() => handleSelectSala(salas[1])} className={salaAssigned==salas[1]?.id && salas[1] ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center', borderRadius:'10px',backgroundColor: salaAssigned==salas[1]?.id && salas[1]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img 
                      src={`${process.env.PUBLIC_URL}/gimnasio.jpeg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity: salas[1]?.opacity,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>{salas[1]?.nombre} ({salas[1]?.capacidad})</p>
                    {errorSala2 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div>)}
                </div>
                  <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                  {salaNoDisponible.includes(salas[2]?.id) ? (<><div className={salaAssigned==salas[2]?.id && salas[1] ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center', borderRadius:'10px', backgroundColor: salaAssigned==salas[2]?.id && salas[2]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                      <img 
                        src={`${process.env.PUBLIC_URL}/salon_de_functional.jpeg`} 
                        alt={'logo'}
                        style={{
                            display: 'block',
                            margin: '10px auto',
                            maxWidth: maxWidthImg,
                            opacity: 0.2,
                            height: 'auto',
                            borderRadius: '8px'
                        }}
                      />
                      <p style={{marginBottom: '0px'}}>Not available</p>
                      {errorSala3 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div></>) : (
                    <div onClick={() => handleSelectSala(salas[2])} className={salaAssigned==salas[2]?.id && salas[1] ? 'box':'input-small-container'} style={{ flex: 3, textAlign: 'center', borderRadius:'10px', backgroundColor: salaAssigned==salas[2]?.id && salas[2]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                      <img 
                        src={`${process.env.PUBLIC_URL}/salon_de_functional.jpeg`} 
                        alt={'logo'}
                        style={{
                            display: 'block',
                            margin: '10px auto',
                            maxWidth: maxWidthImg,
                            opacity: salas[2]?.opacity,
                            height: 'auto',
                            borderRadius: '8px'
                        }}
                      />
                      <p style={{marginBottom: '0px'}}>{salas[2]?.nombre} ({salas[2]?.capacidad})</p>
                      {errorSala3 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div>)}
                  { salaNoDisponible.includes(salas[3]?.id) ? (<><div className={salaAssigned==salas[3]?.id && salas[3  ] ? 'box':'input-small-container'}   style={{ flex: 3, textAlign: 'center', borderRadius:'10px', backgroundColor: salaAssigned==salas[3]?.id && salas[3]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img
                      src={`${process.env.PUBLIC_URL}/salon_de_gimnasio.jpg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity: 0.2,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>Not available</p>
                    {errorSala4 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div></>) : (
                  <div onClick={() => handleSelectSala(salas[3])} className={salaAssigned==salas[3]?.id && salas[3  ] ? 'box':'input-small-container'}   style={{ flex: 3, textAlign: 'center', borderRadius:'10px', backgroundColor: salaAssigned==salas[3]?.id && salas[3]?.opacity===1 ? 'rgba(34, 151, 153, 0.2)' : '' }}>
                    <img
                      src={`${process.env.PUBLIC_URL}/salon_de_gimnasio.jpg`} 
                      alt={'logo'}
                      style={{
                          display: 'block',
                          margin: '10px auto',
                          maxWidth: maxWidthImg,
                          opacity: salas[3]?.opacity,
                          height: 'auto',
                          borderRadius: '8px'
                      }}
                    />
                    <p style={{marginBottom: '0px'}}>{salas[3]?.nombre} ({salas[3]?.capacidad})</p>
                    {errorSala4 && (<p style={{color: 'red', margin: '0px'}}>Not available</p>)}
                  </div>)}
                </div>
                {errorSalas && (<p style={{color: 'red', margin: '0px'}}>Select a room</p>)}
                <ComponenteCreateClass/>
              </div>
            </div>
        </>
      )}
      {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <Loader></Loader>
                </Backdrop>
            ) : null}
            { success ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                          <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                              Class successfully created!
                          </Alert>
                          </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { failureErrors ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                        <div>
                            <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                            Error creating class!
                            </Alert>
                            {errors.length > 0 && errors.map((error, index) => (
                            <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                                <li>{error}</li>
                            </Alert>
                            ))}
                        </div>
                        </Slide>
                    </Box>
                    </div>
                </div>
              
            ) : (
                null
            )}
            { failure ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating class. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            { errorToken ? (
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
  );
}
