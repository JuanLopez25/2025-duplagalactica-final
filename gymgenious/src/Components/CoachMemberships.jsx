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
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Popper from '@mui/material/Popper';
import {jwtDecode} from "jwt-decode";
import { useMediaQuery } from '@mui/material';
import Loader from '../real_components/loader.jsx'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CloseIcon from '@mui/icons-material/Close';


export default function CoachMemberships() {
  const [permanent, setPermanent] = useState('');
  const [name, setName] = useState('');
  const [userAccount,setUserAccount] = useState()
  const [maxNum,setMaxNum] = useState(1);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState('')
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:768px)');
  const [type, setType] = useState(null);
  const [memberships,setMemberships] = useState([])
  const [price1, setPrice1] = useState(0.00);
  const [price2, setPrice2] = useState(0.00);
  const [price3, setPrice3] = useState(0.00);
  const [editPrice1, setEditPrice1] = useState(false);
  const [editPrice2, setEditPrice2] = useState(false);
  const [editPrice3, setEditPrice3] = useState(false);

  const handleEditPrice1 = () => {
    savePrice(price1,'Class')
    setEditPrice1(!editPrice1);
  }

  const savePrice = async (price,type) => {
    setOpenCircularProgress(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        console.error('Token no disponible en localStorage');
        return;
      }
      const response = await fetch('https://two024-duplagalactica-li8t.onrender.com/edit_memb_price', {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({tipo:type,precio:price})
      });
      if (!response.ok) {
        throw new Error('Error al obtener las salas: ' + response.statusText);
      }
      await fetchMembership();
      setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
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
      setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  }

  const handleEditPrice2 = () => {
    savePrice(price2,'Monthly')
    setEditPrice2(!editPrice2);
  }
  const handleEditPrice3 = () => {
    savePrice(price3,'Yearly')
    setEditPrice3(!editPrice3);
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
    if (userAccount) {
      fetchMembership()
    }
  },[userAccount])

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
      //const response = await fetch(`http://127.0.0.1:5000/get_unique_user_by_email?mail=${encodedUserMail}`, {
            method: 'GET', 
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario: ' + response.statusText);
        }
        const data = await response.json();
        setUserAccount(data)
        setType(data.type);
        if(data.type!='coach'){
          navigate('/');
        }
        setOpenCircularProgress(false);
    } catch (error) {
        console.error("Error fetching user:", error);
        setOpenCircularProgress(false);
    }
  };

  return (
    <div className='full-screen-image-2'>
      {type!='coach' ? (
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
            <>
                <LeftBar/>
                <div className='membership-choose-container'>
                    <div className='class-creation-content' style={{paddingTop: '1%'}}>
                    <h2 style={{color:'#424242'}}>Edit Memberships</h2>
                        <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                            <div className="input-small-container2" style={{width:"100%", marginBottom: '0px', alignContent: 'center'}}>
                            <div className='type-memberships' style={{marginRight: '2%'}}>
                            <h3 className="plan-title">Class</h3>
                                <div className="plan-price">
                                    <span className="currency">U$D</span>
                                    {editPrice1 ? (
                                        <input
                                        type="number" 
                                        id="price1" 
                                        name="price1" 
                                        value={price1}
                                        step={0.01}
                                        onChange={(e) => {
                                            const formattedValue = parseFloat(e.target.value).toFixed(2);
                                            setPrice1(formattedValue)
                                        }}
                                      />
                                    ) : (
                                        <span className="price">{memberships.find(membership => membership.type === 'Class')?.price}</span>
                                    )}
                                </div>
                                <ul className="plan-features">
                                <li className="feature available">1 class</li>
                                <li className="feature available">Instant use</li>
                                <li className="feature unavailable"><s>No time restrictions</s></li>
                                </ul>
                            {editPrice1 ? (
                                <button className="choose-plan-btn" onClick={handleEditPrice1}>Save</button>
                            ) : (
                                <button className="choose-plan-btn" onClick={handleEditPrice1}>Edit</button>
                            )}
                            </div>
                            <div className='type-memberships' style={{marginRight: '2%'}}>
                            <h3 className="plan-title">Monthly plan</h3>
                                <div className="plan-price">
                                    <span className="currency">U$D</span>
                                    {editPrice2 ? (
                                        <input
                                        type="number" 
                                        id="price2" 
                                        name="price2" 
                                        value={price2}
                                        step={0.01}
                                        onChange={(e) => {
                                            const formattedValue = parseFloat(e.target.value).toFixed(2);
                                            setPrice2(formattedValue)
                                        }}
                                      />
                                    ) : (
                                        <span className="price">{memberships.find(membership => membership.type === 'Monthly')?.price}</span>
                                    )}
                                </div>
                                <ul className="plan-features">
                                <li className="feature available">12 classes</li>
                                <li className="feature available">1 month</li>
                                <li className="feature available">Can be accumulated</li>
                                </ul>
                                {editPrice2 ? (
                                    <button className="choose-plan-btn" onClick={handleEditPrice2}>Save</button>
                                ) : (
                                    <button className="choose-plan-btn" onClick={handleEditPrice2}>Edit</button>
                                )}
                            </div>
                            <div className='type-memberships'>
                                <h3 className="plan-title">Yearly plan</h3>
                                    <div className="plan-price">
                                        <span className="currency">U$D</span>
                                        {editPrice3 ? (
                                        <input
                                        type="number" 
                                        id="price3" 
                                        name="price3" 
                                        value={price3}
                                        step={0.01}
                                        onChange={(e) => {
                                            const formattedValue = parseFloat(e.target.value).toFixed(2);
                                            setPrice3(formattedValue)
                                        }}
                                      />
                                    ) : (
                                        <span className="price">{memberships.find(membership => membership.type === 'Yearly')?.price}</span>
                                    )}
                                    </div>
                                    <ul className="plan-features">
                                    <li className="feature available">144 classes</li>
                                    <li className="feature available">1 year</li>
                                    <li className="feature available">Can be accumulated</li>
                                    </ul>
                                    {editPrice3 ? (
                                        <button className="choose-plan-btn" onClick={handleEditPrice3}>Save</button>
                                    ) : (
                                        <button className="choose-plan-btn" onClick={handleEditPrice3}>Edit</button>
                                    )}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    </div>
  );
}
