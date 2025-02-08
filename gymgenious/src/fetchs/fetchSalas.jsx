const fetchSalas = async (setOpenCircularProgress,setSalas,setWarningFetchingRoutines,maxNum) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not available in localStorage');
            return;
        }
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_salas`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching rooms: ' + response.statusText);
        }

        const roomsData = await response.json();

        const updatedRooms = roomsData.map(room => ({
            ...room,
            opacity: parseInt(room.capacidad) >= maxNum ? 1 : 0.5
        }));

        setSalas(updatedRooms);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningFetchingRoutines(true);
        setTimeout(() => {
            setWarningFetchingRoutines(false);
        }, 3000);
    }
    finally {
        setOpenCircularProgress(false)
    }
};

export default fetchSalas