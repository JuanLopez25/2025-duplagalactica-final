import formatDate from '../functions/formatDate'

const fetchAssistance = async (setOpenCircularProgress,setRows,setWarningConnection,userMail) => {
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
      const filteredClasses = data.filter(event => event.owner === userMail);
      if (filteredClasses.length === 0) {
        setOpenCircularProgress(false);
        return;
      }
      const response2 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_coach_clients_assistance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response2.ok) {
        throw new Error('Error al obtener los datos del usuario: ' + response2.statusText);
      }
      const data2 = await response2.json();
      console.log("data de assist",data2)
      const matchedAttendances = data2.map(attendance => {
        const matchingClass = filteredClasses.find(filteredClass => filteredClass.id === attendance.IdClase);
        return {
          ...attendance,
          className: matchingClass ? matchingClass.name : null,
          fecha: formatDate(new Date(attendance.Inicio))
        };
      });
      
      console.log(matchedAttendances);
      setRows(matchedAttendances)
    } catch (error) {
      console.error("Error fetching classes:", error);
      setOpenCircularProgress(false);
      setWarningConnection(true);
      setTimeout(() => {
        setWarningConnection(false);
      }, 3000);
    }
    setOpenCircularProgress(false);
  };

export default fetchAssistance