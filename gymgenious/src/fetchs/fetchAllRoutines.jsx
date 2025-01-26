const fetchRoutines = async (setOpenCircularProgress, setTotalRoutines, setRoutines,setWarningConnection) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
        }
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las rutinas: ' + response.statusText);
        }
        const routines = await response.json();
        const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response2.ok) {
            throw new Error('Error al obtener las rutinas asignadas: ' + response2.statusText);
        }
        const assignedRoutines = await response2.json();
        const response3 = await fetch('https://two025-duplagalactica-final.onrender.com/get_excersices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response3.ok) {
            throw new Error('Error al obtener los ejercicios: ' + response3.statusText);
        }
        const exercisesData = await response3.json();
        const response4 = await fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response4.ok) {
            throw new Error('Error al obtener los ejercicios de Train Mate: ' + response4.statusText);
        }
        const exercisesDataFromTrainMate = await response4.json();
        const routinesWithExercisesData = routines.map((routine) => {
            const updatedExercises = routine.excercises.map((exercise) => {
                let matchedExercise = exercisesData.find((ex) => ex.id === exercise.id);
                if (!matchedExercise && Array.isArray(exercisesDataFromTrainMate.exercises)) {
                    matchedExercise = exercisesDataFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
                }
                if (matchedExercise) {
                    return {
                        ...exercise,
                        name: matchedExercise.name,
                        description: matchedExercise.description,
                    };
                }
                return exercise;
            });

            return {
                ...routine,
                excercises: updatedExercises,
            };
        });
        const routinesWithAssignedCount = routinesWithExercisesData.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
                return acc + (assigned.users ? assigned.users.length : 0);
            }, 0);

            return {
                ...routine,
                cant_asignados: totalAssignedUsers,
            };
        });
        const routinesWithAssignedCountAndExerciseLength = routinesWithAssignedCount.map((routine) => {
            return {
                ...routine,
                exercise_length: routine.excercises ? routine.excercises.length : 0,
            };
        });
        setRoutines(routinesWithAssignedCountAndExerciseLength);
        setTotalRoutines(routinesWithAssignedCountAndExerciseLength);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching rutinas:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    }
};

export default fetchRoutines;
