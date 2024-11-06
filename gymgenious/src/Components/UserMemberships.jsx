import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import moment from 'moment'
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';
import Loader from '../real_components/loader.jsx'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

export default function UserMemberships() {
  const [plan, setPlan] = useState('');
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState('')
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [failureErrors, setFailureErrors] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(true);
  const [errorToken,setErrorToken] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [type, setType] = useState(null);
  const [user,setUser] = useState();
  const [membership, setMembership] = useState([]);
  const [errorAquire, setErrorAquire] = useState(false);
  const [upgrade, setUpgrade] = useState(false);

  
  const [memberships,setMemberships] = useState([])

  const hanldeChangeUpgrade = () => {
    setUpgrade(!upgrade);
    setErrorAquire(false);
  }


  const fetchMembership = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/get_membership_template', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Error al obtener las salas: ' + response.statusText);
      }
      const data = await response.json();
      console.log("asi se ve",data)
      setMemberships(data)
      setTimeout(() => {
        setOpenCircularProgress(false);
      }, 3000);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  }

  const ComponenteBotonCreateMembership = () => {
    return (
      <>
      {isSmallScreen ? (
          <div className="grid-container">
            <button onClick={() => handleAquireMembership()} className="draw-outline-button-small">Acquire</button>
          </div>
      ) : (
          <div className="grid-container">
            <CreateClass onClick={() => handleAquireMembership()}>Acquire</CreateClass>
          </div>
      )}
      </>
    );
  };

  const handleAquireMembership = async () => {
    if(plan!=''){
      setErrorAquire(false);
      setOpenCircularProgress(true)
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const fechaHoy = new Date();
        let fechaFin; 
        if (plan === 'monthly') {
            fechaFin = new Date(fechaHoy); 
            fechaFin.setMonth(fechaFin.getMonth() + 1);
        } else if (plan === 'yearly') {
            fechaFin = new Date(fechaHoy); 
            fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        } else {
            fechaFin = 'never';
        }
        const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/aquire_membership_month', {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ inicio: fechaHoy,userId:user.uid,fin: fechaFin,type_memb:plan })
        });
        if (!response.ok) {
          throw new Error('Error al actualizar la clase: ' + response.statusText);
        }
        window.location.reload()
        
        setOpenCircularProgress(false)
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    } else {
      setErrorAquire(true);
    }
    
  };
  
  const CreateClass = ({ children, ...rest }) => {
    return (
      <button {...rest} className="draw-outline-button">
        <span>{children}</span>
        <span className="top" />
        <span className="right" />
        <span className="bottom" />
        <span className="left" />
    </button>
    );
  };

  const validateForm = () => {
      let errors = [];
      

      setErrors(errors);
      return errors.length === 0;
  }

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
    }
  }, []);

  useEffect ( () => {
    if (user) {
      fetchMembership()
    }
  },[user])

  useEffect(() => {
    if (userMail) {
      fetchUser();
    }
  }, [userMail]);

  const fetchUser = async () => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setUser(data)
        setType(data.type);
        const response3 = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_memb_user`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response3.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data3 = await response3.json();
        const membershipsOfUser = data3.filter(memb => memb.userId == data.uid)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        const membresiaFiltered = membershipsOfUser.filter(memb => memb.exp.split('T')[0] > formattedDate); 
        const membershipIds = membresiaFiltered.map(memb => memb.membershipId);
        const response2 = await fetch(`https://two024-duplagalactica-li8t.onrender.com/get_memberships`, {
          method: 'GET', 
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
        });
        const membresia = await response2.json();
        const firstFiler = membresia.filter(memb => membershipIds.includes(memb.id))
        const membFinal = membresiaFiltered.map(memb => {
          const membInfo = membresia.find(membresia => membresia.id === memb.membershipId);
          return {
            ...memb,
            membInfo, 
          };
        });
        console.log("membresia",membFinal)
        setMembership(membFinal);
        if(data.type!='client'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };

  const ComponentViewMemberships = () => {
    return (
        <div className='membership-choose-container' style={{width: isSmallScreen && membership?.length!==0 ? '90%' : '', left: isSmallScreen && membership?.length!==0 ? '5%' : ''}}>
            <div className='class-creation-content' style={{paddingTop: '1%'}}>
            <h2 style={{color:'#424242'}}>Acquire Membership</h2>
                <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                    <div className="input-small-container2" style={{width:"100%", marginBottom: '0px', alignContent: 'center'}}>
                      <div className='type-memberships' style={{marginRight: '2%', backgroundColor: plan==='never' ? '#f5ebe0' : ''}}>
                      <h3 className="plan-title">Class</h3>
                        <div className="plan-price">
                            <span className="currency">U$D</span>
                            <span className="price">{memberships.find(membership => membership.type === 'Class')?.price}</span>
                        </div>
                        <ul className="plan-features">
                          <li className="feature available">1 class</li>
                          <li className="feature available">Instant use</li>
                          <li className="feature unavailable"><s>No time restrictions</s></li>
                        </ul>
                      <button className="choose-plan-btn" onClick={()=>setPlan('never')}>Choose plan</button>
                      </div>
                      <div className='type-memberships' style={{marginRight: '2%', backgroundColor: plan==='monthly' ? '#f5ebe0' : ''}}>
                      <h3 className="plan-title">Monthly plan</h3>
                        <div className="plan-price">
                            <span className="currency">U$D</span>
                            <span className="price">{memberships.find(membership => membership.type === 'Monthly')?.price}</span>
                        </div>
                        <ul className="plan-features">
                          <li className="feature available">12 classes</li>
                          <li className="feature available">1 month</li>
                          <li className="feature available">Can be accumulated</li>
                        </ul>
                      <button className="choose-plan-btn" onClick={()=>setPlan('monthly')}>Choose plan</button>
                      </div>
                      <div className='type-memberships' style={{backgroundColor: plan==='yearly' ? '#f5ebe0' : ''}}>
                      <h3 className="plan-title">Yearly plan</h3>
                        <div className="plan-price">
                            <span className="currency">U$D</span>
                            <span className="price">{memberships.find(membership => membership.type === 'Yearly')?.price}</span>
                        </div>
                        <ul className="plan-features">
                          <li className="feature available">144 classes</li>
                          <li className="feature available">1 year</li>
                          <li className="feature available">Can be accumulated</li>
                        </ul>
                      <button className="choose-plan-btn" onClick={()=>setPlan('yearly')}>Choose plan</button>
                      </div>
                        {/* <label htmlFor="plan" style={{color:'#424242'}}>Type:</label>
                        <select
                            id="plan" 
                            name="plan" 
                            value={plan} 
                            onChange={(e) => setplan(e.target.value)} 
                        >
                            <option value="" >Select</option>
                            <option value="extraClass">Extra class</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select> */}
                    </div>
                </div>
                <ComponenteBotonCreateMembership/>
                {errorAquire && (<p style={{color: 'red', margin: '0px'}}>Select a plan</p>)}
                {membership?.length!==0 && (
                  <button 
                  onClick={hanldeChangeUpgrade} 
                  className="custom-button-go-back-managing"
                >
                  <KeyboardBackspaceIcon sx={{ color: '#F5F5F5' }} />
                </button>
                )}
            </div>
        </div>
    )
  }

  const ComponentMyMembership = () => {
    console.log(membership[0])
    return (
      <div className="membership-card">
      <h2 className='h2-membership'>My Membership</h2>
      <div className="membership-info">
          <div className="info-item">
              <CalendarTodayIcon className="icon-membership" />
              <span>Expiration: {membership[0].exp.split('T')[0]}</span>
          </div>
          <div className="info-item">
              <SchoolIcon className="icon-membership" />
              <span>Remaining classes to annotate: {membership[0].membInfo.top-membership[0].membInfo.BookedClasses.length}</span>
          </div>
          <div className="info-item">
            <SignalCellularAltIcon className="icon-membership"/>
          <span>Progress: {membership[0].membInfo.BookedClasses.length}/{membership[0].membInfo.top}</span>
          </div>
          <div className="progress-container-membership">
              <div
                  className="progress-bar-membership"
                  style={{ width: `${(membership[0].membInfo.BookedClasses.length / membership[0].membInfo.top)*100}%` }}
              ></div>
          </div>
      </div>
      {!upgrade ? (
        <button className="upgrade-btn-membership" onClick={hanldeChangeUpgrade}>Upgrade</button>
      ) : (
        <div className='Modal'>
          <ComponentViewMemberships/>
        </div>
      )}
      
  </div>
    )
  }

  return (
    <div className='full-screen-image-2'>
      {type!='client' || openCircularProgress ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
            <Loader></Loader>
            </Backdrop>
        ) : (
          <>
            <LeftBar/>
            {membership.length!=0 ? (
                <ComponentMyMembership/>
            ) : (
                <ComponentViewMemberships/>
            )}
          </>
      )}
      {openCircularProgress ? (
                <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={openCircularProgress}
                >
                <Loader></Loader>
                </Backdrop>
            ) : null}
            { success ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={success} mountOnEnter unmountOnExit >
                          <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                              Class successfully created!
                          </Alert>
                          </Slide>
                        </Box>
                    </div>
                </div>
            ) : (
                null
            )}
            { failureErrors ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failureErrors} mountOnEnter unmountOnExit>
                        <div>
                            <Alert severity="error" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                            Error creating class!
                            </Alert>
                            {errors.length > 0 && errors.map((error, index) => (
                            <Alert key={index} severity="info" style={{ fontSize: '100%', fontWeight: 'bold' }}>
                                <li>{error}</li>
                            </Alert>
                            ))}
                        </div>
                        </Slide>
                    </Box>
                    </div>
                </div>
              
            ) : (
                null
            )}
            { failure ? (
                <div className='alert-container'>
                    <div className='alert-content'>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Slide direction="up" in={failure} mountOnEnter unmountOnExit >
                        <Alert severity="error" style={{fontSize:'100%', fontWeight:'bold'}}>Error creating class. Try again!</Alert>
                        </Slide>
                    </Box>
                </div>
            </div>
            ) : (
                null
            )}
            { errorToken ? (
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
    </div>
  );
}
