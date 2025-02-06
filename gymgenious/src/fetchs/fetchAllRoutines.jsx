const fetchRoutines = async (setOpenCircularProgress, setTotalRoutines, setRoutines,setWarningConnection) => {
    setOpenCircularProgress(true);
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not available in localStorage');
            return;
        }

        const routinesData = await fetch('https://two025-duplagalactica-final.onrender.com/get_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!routinesData.ok) {
            throw new Error('Error fetching routines: ' + routinesData.statusText);
        }
        const routines = await routinesData.json();

        const assignedRoutinesData = await fetch('https://two025-duplagalactica-final.onrender.com/get_assigned_routines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!assignedRoutinesData.ok) {
            throw new Error('Error fetching assigned routines: ' + assignedRoutinesData.statusText);
        }
        const assignedRoutines = await assignedRoutinesData.json();

        const exercisesDataLocal = await fetch('https://two025-duplagalactica-final.onrender.com/get_excersices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!exercisesDataLocal.ok) {
            throw new Error('Error fetching exercises: ' + exercisesDataLocal.statusText);
        }
        const exercisesList = await exercisesDataLocal.json();


        const exercisesDataExternal = await fetch('https://train-mate-api.onrender.com/api/exercise/get-all-exercises', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!exercisesDataExternal.ok) {
            throw new Error('Error fetching Train Mate exercises: ' + exercisesDataExternal.statusText);
        }
        const exercisesFromTrainMate = await exercisesDataExternal.json();
        console.log("routines",exercisesFromTrainMate)
         const routinesWithExercises = routines.map((routine) => {
            const updatedExercises = routine.excercises.map((exercise) => {
                let matchedExercise = exercisesList.find((ex) => ex.id === exercise.id);
                if (!matchedExercise && Array.isArray(exercisesFromTrainMate.exercises)) {
                    matchedExercise = exercisesFromTrainMate.exercises.find((ex) => ex.id === exercise.id);
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
                exercises: updatedExercises,
            };
        });
        console.log("a")
        const routinesWithAssignedCount = routinesWithExercises.map((routine) => {
            const assignedForRoutine = assignedRoutines.filter((assigned) => assigned.id === routine.id);
            const totalAssignedUsers = assignedForRoutine.reduce((acc, assigned) => {
                return acc + (assigned.users ? assigned.users.length : 0);
            }, 0);

            return {
                ...routine,
                cant_asignados: totalAssignedUsers,
            };
        });

        console.log("b")
        const finalRoutines = routinesWithAssignedCount.map((routine) => ({
            ...routine,
            exercise_length: routine.exercises ? routine.exercises.length : 0,
        }));


        setRoutines(finalRoutines);
        setTotalRoutines(finalRoutines);

    } catch (error) {
        console.error("Error fetching routines:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
            setWarningConnection(false);
        }, 3000);
    } finally {
        setOpenCircularProgress(false);
    }
};

export default fetchRoutines;
