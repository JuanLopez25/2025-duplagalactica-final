import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import verifyToken from '../fetchs/verifyToken.jsx'
import { useNavigate } from 'react-router-dom';
import Loader from '../real_components/loader.jsx';
import Searcher from '../real_components/searcher.jsx';
import CustomTable from '../real_components/Table3columns.jsx';
import fetchExercises from '../fetchs/fetchExercises.jsx'
import fetchUser from '../fetchs/fetchUser.jsx'

export default function CoachExercises() {
    const [id,setId] = useState()
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [userMail, setUserMail] = useState('');
    const isSmallScreen650 = useMediaQuery('(max-width:650px)');
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [errorToken, setErrorToken] = useState(false);
    const [warningConnection, setWarningConnection] = useState(false);
    const [exercises, setExercises] = useState([]);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [type, setType] = useState(null);
    const [editExercise, setEditExercise] = useState(false);
    const [name, setName] = useState('');
    const [errorNoChange,setErrorNoChange] = useState(false)
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState(null);
    const[fetchImg, setImageFetch] = useState('')
    const[fetchName,setNameFetch] = useState('')
    const[fetchDes,setDescFetch] = useState('')
    const [filterExercises, setFilterExercises] = useState('');
    const [totalExercises, setTotalExercises] = useState([]);
  
    const handleSelectEvent = (event) => {
        console.log("evento",event)
        setSelectedEvent(event);
    };

    const handleCloseModalEvent = () => {
        setSelectedEvent(null);
      };

    const handleEditExercise = (event) => {
        setEditExercise(!editExercise);
        setImageFetch(event.image_url);
        setNameFetch(event.name);
        setDescFetch(event.description);
        setId(event.id)
    } 

    const handleCloseModal = () => {
        setEditExercise(false);
    };

    const correctExercisesData = async (exercisesData) => {
        return exercisesData.map(element => {
            if (!element.owner) {
                return {
                    name: element.name,
                    description: 'aaaa',
                    owner: 'Train-Mate'
                };
            }
            return element;
        });
    };   

    useEffect(() => {
        if(filterExercises!=''){
          const filteredExercisesSearcher = totalExercises.filter(item => 
            item.name.toLowerCase().startsWith(filterExercises.toLowerCase())
          );
          setExercises(filteredExercisesSearcher);
        } else {
            setExercises(totalExercises);
        }
    
      }, [filterExercises]);


    const validateForm = () => {
        let res = true
        console.log("name",name)
        console.log("fetchedName",fetchName)
        console.log("desc",desc)
        console.log("fetchedDesc",fetchDes)
        console.log("image",image)
        if ((name==fetchName || name=='') && (desc==fetchDes || desc=='') && (!image || image==fetchImg)) {
            res = false
            setErrorNoChange(true)
        } else {
            setErrorNoChange(false)
        }

        return res
    }

    const handleSaveEditExer = async () => {
        if (validateForm()) {
            try {
                const formData = new FormData();
                formData.append('name', name || fetchName);
                formData.append('description', desc || fetchDes);
                formData.append('image_url', fetchImg);
                formData.append('id',id);
                formData.append('image', image);
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                console.error('Token no disponible en localStorage');
                return;
                }
                const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_exer_info', {
                    method: 'PUT', 
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Error al actualizar la rutina: ' + response.statusText);
                }
                setTimeout(() => {
                    setOpenCircularProgress(false);
                }, 2000);
                window.location.reload();
            } catch (error) {
                console.error("Error actualizarndo la rutina:", error);
                setOpenCircularProgress(false);
                setWarningConnection(true);
                setTimeout(() => {
                setWarningConnection(false);
                }, 3000);
                setEditExercise(!editExercise);
            } finally {
                setEditExercise(!editExercise);
            }
        }
    }

    const saveExercise = async (event) => {
        event.preventDefault(); 
        handleSaveEditExer();
        setTimeout(() => {
          setOpenCircularProgress(false);
        }, 7000);
        await fetchExercises(setOpenCircularProgress,setWarningConnection,setExercises,setTotalExercises,correctExercisesData);
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken)
        } else {
            navigate('/');
            console.error('No token found');
        }
    }, []);
    
    useEffect(() => {
        if (userMail) {
            fetchUser(setType,setOpenCircularProgress,userMail,navigate)
        }
    }, [userMail]);

    useEffect(() => {
    if(type==='coach'){
        fetchExercises(setOpenCircularProgress,setWarningConnection,setExercises,setTotalExercises,correctExercisesData);
    }
    }, [type]);


    return (
        <div className="App">
            {type!='coach' ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={true}
                >
                    <Loader></Loader>
                </Backdrop>
            ) : (
                <>
                    <NewLeftBar />
                    <Searcher filteredValues={filterExercises} setFilterValues={setFilterExercises} isSmallScreen={isSmallScreen} searchingParameter={'exercise name'}/>
                    {openCircularProgress && (
                        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
                            <Loader></Loader>
                        </Backdrop>
                    )}
                    {warningConnection && (
                        <div className='alert-container'>
                            <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit>
                                    <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="info">
                                        Connection Error. Try again later!
                                    </Alert>
                                </Slide>
                            </Box>
                            </div>
                        </div>
                    )}
                    {errorToken && (
                        <div className='alert-container'>
                            <div className='alert-content'>
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit>
                                    <Alert style={{ fontSize: '100%', fontWeight: 'bold' }} severity="error">
                                        Invalid Token!
                                    </Alert>
                                </Slide>
                            </Box>
                            </div>
                        </div>
                    )}
                    {exercises && (
                        <CustomTable columnsToShow={['Name','Description','Owner','There are no created exercises']} data={exercises} handleSelectEvent={handleSelectEvent} vals={['name','description','owner']}/> 
                    )}
                    {selectedEvent && (
                        <div className="Modal" onClick={handleCloseModalEvent}>
                            <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{marginBottom: '0px'}}>Exercise:</h2>
                                <h5 style={{ marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    {selectedEvent.name}
                                </h5>
                                <p style={{ marginTop: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    {selectedEvent.description}
                                </p>
                                <img 
                                    src={selectedEvent.image_url} 
                                    alt={selectedEvent.name}
                                    style={{
                                        display: 'block',
                                        margin: '10px auto',
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: '8px'
                                    }} 
                                />
                                {selectedEvent.owner==userMail? (
                                <button style={{width: isSmallScreen650 ? '70%' : '30%'}} onClick={()=> handleEditExercise(selectedEvent)}>Edit exercise</button>
                                ) :(<></>)}                            
                                <button onClick={handleCloseModalEvent} style={{marginTop: isSmallScreen650 ? '10px' : '', marginLeft: isSmallScreen650 ? '' : '10px', width: isSmallScreen650 ? '70%' : '30%'}}>Close</button>
                            </div>
                        </div>
                    )}
                    {editExercise && (
                        <div className="Modal-edit-routine" onClick={handleCloseModal}>
                            <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                                <form autoComplete='off' onSubmit={saveExercise}>
                                    <h2>Exercise details</h2>
                                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                        <div className="input-small-container">
                                        <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            value={name} 
                                            placeholder={fetchName}
                                            onChange={(e) => setName(e.target.value)} 
                                        />
                                        </div>
                                    </div>
                                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                        <div className="input-small-container">
                                            <label htmlFor="desc" style={{color:'#14213D'}}>Desc:</label>
                                            <textarea 
                                                onChange={(e) => setDesc(e.target.value)}
                                                name="desc"
                                                id="desc"
                                                rows={4}
                                                value={desc}
                                                placeholder={fetchDes}
                                                maxLength={300}
                                                style={{maxHeight: '150px', width: '100%', borderRadius: '8px'}} />
                                        </div>
                                    </div>
                                    <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                                        <div className="input-small-container">
                                        <label htmlFor="image" style={{ color: '#14213D' }}>Image:</label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            className='input-image'
                                            onChange={(e) => setImage(e.target.files[0])                  
                                            }  
                                        />
                                        </div>
                                    </div>
                                    {errorNoChange && (<p style={{color: 'red', margin: '0px'}}>There are no changes</p>)}
                                    <button type="submit" className='button_login' style={{width: isSmallScreen650 ? '70%' : '30%'}}>Save</button>                            
                                    <button onClick={handleCloseModal} className='button_login' style={{marginTop: isSmallScreen650 ? '10px' : '', marginLeft: isSmallScreen650 ? '' : '10px', width: isSmallScreen650 ? '70%' : '30%'}}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
