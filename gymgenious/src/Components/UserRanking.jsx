import * as React from 'react';
import { Paper, useMediaQuery, Box} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from 'react';
import verifyToken from '../fetchs/verifyToken.jsx';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import fetchUser from '../fetchs/fetchUser.jsx';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NewLeftBar from '../real_components/NewLeftBar';
import Backdrop from '@mui/material/Backdrop';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Loader from '../real_components/loader.jsx';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import CustomTable from '../real_components/Table4columns.jsx';

export default function StickyHeadTable() {
    const [userMail, setUserMail] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [warningConnection, setWarningConnection] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const navigate = useNavigate();    
    const [errorToken,setErrorToken] = useState(false);
    const [type, setType] = useState(null);
    const [viewCreateRanking, setViewCreateRanking] = useState(false);
    const [viewJoinRanking, setViewJoinRanking] = useState(false);
    const [name, setName] = useState('');
    const [nameRanking, setNameRanking] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRanking, setPasswordRanking] = useState('');
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorPasswordRanking, setErrorPasswordRanking] = useState(false);
    const [errorNameRanking, setErrorNameRanking] = useState(false);
    const [errorCredentials, setErrorCredentials] = useState(false);
    const [errorAlreadyJoined, setErrorAlreadyJoined] = useState(false);
    const [rankings,setRankings] = useState([])



    useEffect(() => {
        if (type!='client' && type!=null) {
        navigate('/');      
        }
      }, [type]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const handleViewCreateRanking = () => {
        setViewCreateRanking(!viewCreateRanking);
        setName('');
        setPassword('');
        setErrorName(false);
        setErrorPassword(false);
    };

    const handleViewJoinRanking = () => {
        setViewJoinRanking(!viewJoinRanking);
        setNameRanking('');
        setPasswordRanking('');
        setErrorNameRanking(false);
        setErrorPasswordRanking(false);
        setErrorCredentials(false);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    const fetchRanking = async () => {
        setOpenCircularProgress(true);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
            }
            const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_rankings', {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            });
            if (!response.ok) {
            throw new Error('Error al obtener las salas: ' + response.statusText);
            }
            const data = await response.json();
            const userRankings = data.filter(rank=>rank.participants.includes(userMail))
            const response2 = await fetch(`https://two025-duplagalactica-final.onrender.com/get_users`, {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response2.ok) {
                throw new Error('Error al obtener las rutinas: ' + response2.statusText);
            }
            const users = await response2.json();
            const updatedRankings = userRankings.map(rank => {
            return {
                ...rank,
                participants: rank.participants.map(participantMail => {
                const user = users.find(u => u.Mail === participantMail);
                return {
                    mail: participantMail,
                    MissionsCompleted: user ? user.MissionsComplete : null 
                };
                })
            };
            });
            const updatedRankings2 = updatedRankings.map(rank => {
                return {
                    ...rank,
                    participants_length: rank.participants.length
                };
            });
            setRankings(updatedRankings2)
            setTimeout(() => {
            setOpenCircularProgress(false);
            }, 3000);
        } catch (error) {
            console.error("Error fetching user:", error);
            setOpenCircularProgress(false);
            setWarningConnection(true);
            setTimeout(() => {
                setWarningConnection(false);
            }, 3000);
        }
    };

    const validateRanking = () => {
        let res=true;
        setErrorName(false);
        setErrorPassword(false);
        if(name==='') {
            setErrorName(true);
            res=false;
        }
        if(password==='') {
            setErrorPassword(true);
            res=false;
        }
        return res;
    }

    const createRanking = async () => {
        if(validateRanking()){
            setOpenCircularProgress(true);
                try {  
                const newRoutine = {
                    participants: [userMail],
                    name: name,
                    password: password,
                };
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    console.error('Token no disponible en localStorage');
                    return;
                }
                const response = await fetch('https://two025-duplagalactica-final.onrender.com/create_ranking', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(newRoutine),
                });
            
                if (!response.ok) {
                    throw new Error('Error al crear el ranking');
                }
                await fetchRanking();
                setOpenCircularProgress(false);
                handleViewCreateRanking();
            } catch (error) {
                console.error("Error al crear el ranking:", error);
                setOpenCircularProgress(false);
                setWarningConnection(true);
                setTimeout(() => {
                    setWarningConnection(false);
                }, 3000);
            };
        }
    };

    const validateRanking2 = () => {
        let res=true;
        setErrorNameRanking(false);
        setErrorPasswordRanking(false);
        if(nameRanking==='') {
            setErrorNameRanking(true);
            res=false;
        }
        if(passwordRanking==='') {
            setErrorPasswordRanking(true);
            res=false;
        }
        return res;
    }

    const joinRanking = async () => {
        if(validateRanking2()){
            setOpenCircularProgress(true);
            setErrorCredentials(false);
            setErrorAlreadyJoined(false);
            try {  
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    console.error('Token no disponible en localStorage');
                    return;
                }
                const alreadyJoined = rankings.some(rank => rank.id === nameRanking);
                if(alreadyJoined){
                    throw new Error('ya te has unido a este ranking')
                }
                const response = await fetch('https://two025-duplagalactica-final.onrender.com/get_rankings', {
                    method: 'GET', 
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                throw new Error('Error al obtener las salas: ' + response.statusText);
                }
                const data = await response.json();
                const userRankings = data.filter(rank=>(rank.id==nameRanking && rank.password==passwordRanking))
                console.log("estos son los ur",passwordRanking)
                if (userRankings.length==0) {
                    throw new Error('No existe ningun ranking asi');
                }
                const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/join_ranking', {
                    method: 'PUT', 
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({ id: nameRanking,user:userMail })
                });
                if (!response2.ok) {
                throw new Error('Error al entrar al ranking: ' + response2.statusText);
                }
                await fetchRanking();
                setOpenCircularProgress(false);
                handleViewJoinRanking();
            } catch (error) {
                console.error("Error al crear el ranking:", error);
                setOpenCircularProgress(false);
                if(error=='Error: No existe ningun ranking asi'){
                    setErrorCredentials(true);
                }
                else if(error=='Error: ya te has unido a este ranking'){
                    setErrorAlreadyJoined(true);
                } else {
                    setWarningConnection(true);
                    setTimeout(() => {
                        setWarningConnection(false);
                    }, 3000);
                }
            }
        }
    };

    const handleLeaveRanking = async () => {
        setOpenCircularProgress(true);
        try {  
            
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                console.error('Token no disponible en localStorage');
                return;
            }
            const response2 = await fetch('https://two025-duplagalactica-final.onrender.com/leave_ranking', {
                method: 'PUT', 
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ id: selectedEvent.id,user: userMail})
            });
            if (!response2.ok) {
            throw new Error('Error al entrar al ranking: ' + response2.statusText);
            }
            await fetchRanking();
            setOpenCircularProgress(false);
            handleCloseModal();
        } catch (error) {
            console.error("Error al crear el ranking:", error);
            setOpenCircularProgress(false);
            setWarningConnection(true);
            setTimeout(() => {
                setWarningConnection(false);
            }, 3000);
        };
    };
    

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
        } else {
            navigate('/');
            console.error('No token found');
            return;
        }
      }, []);

    useEffect(() => {
    if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection);
    }
    }, [userMail]);

    useEffect(() => {
    if(type==='client'){
        fetchRanking();
    }
    }, [type])
    

    return (
        <div className="App">
          <>
            <NewLeftBar />
            <div className='input-container-buttons' style={{left: isSmallScreen ? '6vh' : '8vh', position: 'absolute', top: '0.5%'}}>
                <div className='input-small-container-buttons' onClick={handleViewCreateRanking}>
                    <Button onClick={handleViewCreateRanking}
                    style={{
                        backgroundColor: '#48CFCB',
                        borderRadius: '50%',
                        width: '5vh',
                        height: '5vh',
                        minWidth: '0',
                        minHeight: '0',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    <AddIcon sx={{ color: '#424242' }} />
                    </Button>
                </div>
            </div>
            <div className='input-container-buttons' style={{left: isSmallScreen? '12vh' : '16vh', position: 'absolute', top: '0.5%'}}>
                <div className='input-small-container-buttons'>
                    <Button onClick={handleViewJoinRanking}
                    style={{
                        backgroundColor: '#48CFCB',
                        borderRadius: '50%',
                        width: '5vh',
                        height: '5vh',
                        minWidth: '0',
                        minHeight: '0',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                    <GroupAddIcon sx={{ color: '#424242' }} />
                    </Button>
                </div>
            </div>
            {rankings && (
                          <CustomTable columnsToShow={['Name','Ranking ID', 'Users ranked','Ranking Password','There are no rankings']} data={rankings} handleSelectEvent={handleSelectEvent} vals={['name','id','participants_length','password']}/> 
            )}
            {selectedEvent && (
                <div className="Modal" onClick={handleCloseModal}>
                    <div className="Modal-Content-view-exercises" onClick={(e) => e.stopPropagation()}>
                        <h2 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}>{selectedEvent.name}</h2>
                        {isSmallScreen && (
                            <h5 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}>{selectedEvent.id}</h5>
                        )}
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                    <TableCell sx={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto'}}>User</TableCell>
                                    <TableCell>Missions completed</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedEvent?.participants
                                    ?.slice() 
                                    .sort((a, b) => b.MissionsCompleted - a.MissionsCompleted) 
                                    .map((user, index) => (
                                        <TableRow key={index}>
                                        <TableCell sx={{}}>{user.mail}</TableCell>
                                        <TableCell>
                                            {user.MissionsCompleted}
                                            {index==0 ? (
                                                <WorkspacePremiumIcon sx={{ color: 'gold' }} />
                                            ):
                                            (
                                                <>
                                                {index==1 ? (
                                                    <WorkspacePremiumIcon sx={{ color: "#C0C0C0" }} />
                                                ):
                                                (
                                                    <>
                                                    {index==2 ? (
                                                        <WorkspacePremiumIcon sx={{ color: "#CD7F32" }} />
                                                    ):
                                                    (
                                                        <>                                                        
                                                        </>
                                                    )
                                                    }
                                                    </>
                                                )
                                                }
                                                </>
                                            )
                                            } 
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <button onClick={handleLeaveRanking} style={{width: isSmallScreen ? '70%' : '40%',marginTop:'2vh'}}>Leave ranking</button>
                        <button onClick={handleCloseModal} style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px', width: isSmallScreen ? '70%' : '40%'}}>Close</button>
                    </div>
                </div>
            )}
            {viewCreateRanking && (
                <div className="Modal" onClick={handleViewCreateRanking}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create Ranking</h2>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#424242'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                autocomplete="new-password"
                            />
                            {errorName && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a ranking name</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#424242'}}>Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autocomplete="new-password"
                            />
                            {errorPassword && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a password</p>)}
                        </div>
                        <button onClick={createRanking} style={{width: isSmallScreen ? '70%' : '40%'}}>Create ranking</button>
                        <button onClick={handleViewCreateRanking} style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px', width: isSmallScreen ? '70%' : '40%'}}>Close</button>
                    </div>
                </div>
            )}
            {viewJoinRanking && (
                <div className="Modal" onClick={handleViewJoinRanking}>
                    <div className="Modal-Content" onClick={(e) => e.stopPropagation()}>
                        <h2>Join Ranking</h2>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#424242'}}>ID:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={nameRanking} 
                                onChange={(e) => setNameRanking(e.target.value)}
                                autocomplete="new-password"
                            />
                            {errorNameRanking && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a ranking id</p>)}
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#424242'}}>Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={passwordRanking}
                                onChange={(e) => setPasswordRanking(e.target.value)}
                                autocomplete="new-password"
                            />
                            {errorPasswordRanking && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Enter a password</p>)}
                        </div>
                        {errorCredentials && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>Invalid credentials</p>)}
                        {errorAlreadyJoined && (<p style={{color: 'red', margin: '0px', textAlign: 'left'}}>You are already in that ranking</p>)}
                        <button onClick={joinRanking} style={{width: isSmallScreen ? '70%' : '40%'}}>Join ranking</button>
                        <button onClick={handleViewJoinRanking} style={{marginTop: isSmallScreen ? '10px' : '', marginLeft: isSmallScreen ? '' : '10px', width: isSmallScreen ? '70%' : '40%'}}>Close</button>
                    </div>
                </div>
            )}
            {openCircularProgress && (
                <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
                    <Loader></Loader>
                </Backdrop>
            )}
            {errorToken ? (
              <div className='alert-container'>
                <div className='alert-content'>
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Slide direction="up" in={errorToken} mountOnEnter unmountOnExit >
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="error">
                        Invalid Token!
                      </Alert>
                    </Slide>
                  </Box>
                </div>
              </div>
            ) : (
              null
            )}
            {warningConnection ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={warningConnection} mountOnEnter unmountOnExit >
                            <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                            Connection Error. Try again later!
                            </Alert>
                        </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            </>
        </div>
    );
}
