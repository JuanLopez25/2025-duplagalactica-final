
import timeToMinutes from '../functions/TimeToMinutes.jsx'
import day from '../functions/DateToString.jsx';

const validateSalas = async (setValidating,setOpenCircularProgress,setErrorSalas,setSalaNoDisponible,setErrorSala1,setErrorSala2,setErrorSala3,setErrorSala4,date,hour,hourFin,permanent,salaAssigned) => {
    setValidating(true)
    setOpenCircularProgress(true);
    setErrorSalas(false);
    try {
        const salasError = []
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token not available in localStorage');
            return;
        }

        const classResponse = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!classResponse.ok) {
            throw new Error('Error fetching classes: ' + classResponse.statusText);
        }

        const data = await classResponse.json();
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

export default validateSalas