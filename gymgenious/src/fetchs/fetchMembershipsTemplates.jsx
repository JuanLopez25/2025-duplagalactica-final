const fetchMembership = async (setMemberships,setOpenCircularProgress) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_membership_template', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener las salas: ' + response.statusText);
      }
      const data = await response.json();
      setMemberships(data)
      setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export default fetchMembership