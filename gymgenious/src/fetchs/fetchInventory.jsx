const fetchInventory = async ( setItemData,setOpenCircularProgress) => {
    setOpenCircularProgress(true)
    try {
      const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not available in localStorage');
            return;
        }
      
      try {
        const inventoryRequest = await fetch(`https://two025-duplagalactica-final.onrender.com/get_inventory`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!inventoryRequest.ok) {
            throw new Error('Error fetching inventory data: ' + inventoryRequest.statusText);
        }

        const inventoryItems = await inventoryRequest.json();
        const inventoryWithQuantities = inventoryItems.map((item) => ({
          ...item,
          cantidad: 0,
          totalReservado: 0,
          reservas: [],
        }));


        const classesRequest = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!classesRequest.ok) {
            throw new Error('Error fetching classes: ' + classesRequest.statusText);
        }
        const classesData = await classesRequest.json();

        classesData.forEach((classItem) => {
            classItem.reservations.forEach((reservation) => {
                const item = inventoryWithQuantities.find((i) => i.id === reservation.item);
                if (item) {
                    item.reservations.push({ 'name': classItem.name, 'cantidad': reservation.cantidad });
                }
            });
        });

        classesData.forEach((classItem) => {
            classItem.reservations.forEach((reservation) => {
                const item = inventoryWithQuantities.find((i) => i.id === reservation.item);
                if (item) {
                    item.totalReservado += reservation.cantidad;
                }
            });
        });
        
        setItemData(inventoryWithQuantities);      
      } catch (error) {
        console.error("Error:", error.message);
      }      
    } catch (error) {
        console.error("Error fetching inventory:", error);
    } finally {
        setOpenCircularProgress(false)
    }
};

export default fetchInventory