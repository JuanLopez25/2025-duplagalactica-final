import formatDate from '../functions/formatDate'

const fetchAssistance = async (setOpenCircularProgress,setRows,setWarningConnection,userMail) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
          console.error('Token not available in localStorage');
          return;
      }

      const classesRequest = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
      if (!classesRequest.ok) {
          throw new Error('Error fetching classes: ' + classesRequest.statusText);
      }
      const classList = await classesRequest.json();


      const ownedClasses = classList.filter(classItem => classItem.owner === userMail);
      if (ownedClasses.length === 0) {
          setOpenCircularProgress(false);
          return;
      }

      
      const attendanceRequest = await fetch('https://two025-duplagalactica-final.onrender.com/get_coach_clients_assistance', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
      });
      if (!attendanceRequest.ok) {
          throw new Error('Error fetching attendance data: ' + attendanceRequest.statusText);
      }
      const attendanceRecords = await attendanceRequest.json();

      const formattedAttendance = attendanceRecords.map(attendance => {
          const matchingClass = ownedClasses.find(classItem => classItem.id === attendance.classId);
          return {
              ...attendance,
              className: matchingClass ? matchingClass.name : null,
              fecha: formatDate(new Date(attendance.startTime))
          };
      });
      setRows(formattedAttendance);

      
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