const fetchExercises = async (setOpenCircularProgress,setWarningConnection,setExercises,setTotalExercises,correctExercisesData) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_excersices`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los ejercicios: ' + response.statusText);
        }
        const exercisesData = await response.json();
        const response2 = await fetch(`https://train-mate-api.onrender.com/api/exercise/get-all-exercises`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        const exercisesDataFromTrainMate = await response2.json();
        const totalExercises = exercisesData.concat(exercisesDataFromTrainMate.exercises)
        const totalExercisesCorrected = await correctExercisesData(totalExercises);
        setExercises(totalExercisesCorrected);
        setTotalExercises(totalExercisesCorrected);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching users:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
};

export default fetchExercises