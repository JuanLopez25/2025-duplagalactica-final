import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { jwtDecode } from "jwt-decode";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import NewLeftBar from '../real_components/NewLeftBar';
import ColorToggleButton from '../real_components/ColorToggleButton.jsx';
import Backdrop from '@mui/material/Backdrop';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CircularProgress from '@mui/material/CircularProgress';
import DaySelection from '../real_components/DaySelection.jsx';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

export default function StickyHeadTable() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('name');
    const [order, setOrder] = useState('asc');
    const [userMail, setUserMail] = useState('');
    const [routines, setRoutines] = useState([]);
    const [routine, setRoutine] = useState([]);
    const [selectedDay, setSelectedDay] = useState('');
    const isSmallScreen = useMediaQuery('(max-width:700px)');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rows, setRows] = useState([]);
    const [errorToken, setErrorToken] = useState(false);
    const [openCircularProgress, setOpenCircularProgress] = useState(false);
    const [dense, setDense] = useState(false);
    const navigate = useNavigate();
    const [type, setType] = useState(null);
    const [warningFetchingUserRoutines, setWarningFetchingUserRoutines] = useState(false);
    const isMobileScreen = useMediaQuery('(min-height:750px)');
    const [maxHeight, setMaxHeight] = useState('600px');
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

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
            setRankings(updatedRankings)
            setTimeout(() => {
            setOpenCircularProgress(false);
            }, 3000);
        } catch (error) {
            console.error("Error fetching user:", error);
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
                if(error=='Error: ya te has unido a este ranking'){
                    setErrorAlreadyJoined(true);
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
        };
    };
    
    const verifyToken = async (token) => {
        try {
            const decodedToken = jwtDecode(token);
            setUserMail(decodedToken.email);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setErrorToken(true);
            setTimeout(() => {
              setErrorToken(false);
            }, 3000);
            throw error;
        }
      };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            verifyToken(token);
        } else {
            navigate('/');
            console.error('No token found');
            return;
        }
      }, []);

    useEffect(() => {
    if (userMail) {
        fetchUser();
    }
    }, [userMail]);

    useEffect(() => {
    if(type==='client'){
        fetchRanking();
    }
    }, [type])
    
      const fetchUser = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
              console.error('Token no disponible en localStorage');
              return;
            }
          const encodedUserMail = encodeURIComponent(userMail);
          const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
            if (!response.ok) {
                throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
            }
            const data = await response.json();
            setType(data.type);
            if(data.type!='client'){
              navigate('/');
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
      };

    useEffect(() => {
        if(isSmallScreen) {
          setRowsPerPage(10);
        } else {
          setRowsPerPage(5)
        }
        if(isMobileScreen) {
          setMaxHeight('700px');
        } else {
          setMaxHeight('600px')
        }
      }, [isSmallScreen, isMobileScreen])

    const visibleRows = React.useMemo(
        () =>
          [...rankings]
            .sort((a, b) =>
              order === 'asc'
                ? a[orderBy] < b[orderBy]
                  ? -1
                  : 1
                : a[orderBy] > b[orderBy]
                ? -1
                : 1
            )
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rankings]
      );

    return (
        <div className="App">
            {type!='client' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
          <>
            <NewLeftBar />
            <div className='input-container-buttons' style={{left: isSmallScreen ? '60px' : '50px', position: 'absolute', top: '0.5%'}}>
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
            <div className='input-container-buttons' style={{left: isSmallScreen ? '115px' : '97px', position: 'absolute', top: '0.5%'}}>
                <div className='input-small-container-buttons' onClick={handleViewJoinRanking}>
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
            <div className="Table-Container" style={{alignItems: 'center'}}>
                <Box sx={{ width: '100%', flexWrap: 'wrap', background: '#F5F5F5', border: '2px solid #424242', borderRadius: '10px' }}>
                    <Paper
                        sx={{
                        width: '100%',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '10px'
                        }}
                    >
                        <TableContainer sx={{maxHeight: {maxHeight}, overflow: 'auto'}}>
                            <Table
                                sx={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <TableHead>
                                    <TableRow sx={{ height: '5vh', width: '5vh' }}>
                                        <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                            <TableSortLabel
                                                active={orderBy === 'name'}
                                                direction={orderBy === 'name' ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, 'name')}
                                            >
                                                Name
                                                {orderBy === 'name' ? (
                                                    <Box component="span" sx={visuallyHidden}>
                                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                    </Box>
                                                ) : null}
                                            </TableSortLabel>
                                        </TableCell>
                                        {!isSmallScreen && (
                                            <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                                <TableSortLabel
                                                    active={orderBy === 'usersRanked'}
                                                    direction={orderBy === 'usersRanked' ? order : 'asc'}
                                                    onClick={(event) => handleRequestSort(event, 'usersRanked')}
                                                >
                                                    Users Ranked
                                                    {orderBy === 'usersRanked' ? (
                                                        <Box component="span" sx={visuallyHidden}>
                                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                        </Box>
                                                    ) : null}
                                                </TableSortLabel>
                                            </TableCell>
                                        )}
                                        {!isSmallScreen && (
                                            <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                                <TableSortLabel
                                                >
                                                    Ranking ID
                                                </TableSortLabel>
                                            </TableCell>
                                        )}
                                        <TableCell sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', fontWeight: 'bold' }}>
                                            <TableSortLabel
                                            >
                                                Ranking password
                                            </TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {visibleRows.length===0 ? (
                                        <TableRow>
                                        <TableCell colSpan={isSmallScreen ? 2 : 4} align="center" sx={{ color: '#424242', borderBottom: '1px solid #424242' }}>
                                            There are no rankings
                                        </TableCell>
                                        </TableRow>
                                    ) : (
                                        visibleRows.map((row) => (
                                        <TableRow onClick={() => handleSelectEvent(row)} hover tabIndex={-1} key={`${row.id}-${row.day}`} sx={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                            {row.name}
                                            </TableCell>
                                            {!isSmallScreen && (
                                                <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242' }}>
                                                {row.participants.length}
                                                </TableCell>
                                            )}
                                            {!isSmallScreen && (
                                                <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                                {row.id}
                                                </TableCell>
                                            )}
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #424242', borderRight: '1px solid #424242', color: '#424242', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 'auto' }}>
                                            {row.password}
                                            </TableCell>
                                        </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {visibleRows.length!=0 ? (
                            <>
                                {isSmallScreen ? (
                                    <TablePagination
                                        rowsPerPageOptions={[10]}
                                        component="div"
                                        count={rankings.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                    />
                                ) : (
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={rankings.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                )}
                            </>
                        ) : (
                            null
                        )}
                    </Paper>
                </Box>
            </div>
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
            </>
        )}
        </div>
    );
}
