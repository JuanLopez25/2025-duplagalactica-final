const fetchInventory = async ( setItemData,setOpenCircularProgress) => {
    setOpenCircularProgress(true)
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
        const itemsWithQuantities = data.map((item) => ({
          ...item,
          cantidad: 0, 
          totalReservado: 0,
          reservas: []
        }));
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_classes');
        if (!response2.ok) {
          throw new Error('Error al obtener las clases: ' + response2.statusText);
        }
        const data2 = await response2.json();
        data2.forEach((clase) => {
          clase.reservations.forEach((objeto) => {
            const item = itemsWithQuantities.find((i) => i.id === objeto.item);
            if (item) {
              item.reservas.push({'name':clase.name,'cantidad': objeto.cantidad})
            }
          });
        })
        data2.forEach((clase) => {
          clase.reservations.forEach((objeto) => {
            const item = itemsWithQuantities.find((i) => i.id === objeto.item);
            if (item) {
              item.totalReservado += objeto.cantidad;
            }
          });
        });
        
        setItemData(itemsWithQuantities);
        console.log("Lista de items actualizada con total reservado:", itemsWithQuantities);
      
      } catch (error) {
        console.error("Error:", error.message);
      }
      
    } catch (error) {
        console.error("Error fetching user:", error);
    } finally {
        setOpenCircularProgress(false)
    }
};

export default fetchInventory