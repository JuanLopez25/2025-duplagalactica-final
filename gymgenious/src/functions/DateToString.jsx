const day = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado','Domingo'];
    return daysOfWeek[date.getDay()];
};

export default day