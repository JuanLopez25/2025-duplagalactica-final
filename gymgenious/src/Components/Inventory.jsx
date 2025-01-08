import React, {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import {jwtDecode} from "jwt-decode";
import Loader from '../real_components/loader.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import CloseIcon from '@mui/icons-material/Close';





function CouchClasses() {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userMail,setUserMail] = useState(null)
  const isSmallScreen400 = useMediaQuery('(max-width:400px)');
  const isSmallScreen500 = useMediaQuery('(max-width:500px)');
  const isSmallScreen600 = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const isMobileScreen = useMediaQuery('(min-height:750px)');
  const [type, setType] = useState(null);
  const [selectedEvent,setSelectedEvent] = useState(null);
  
  function calculateRemainingAmount(item) {
    const sumOfSublistValues = item.reservas.reduce((acc, sublist) => acc + sublist[1], 0);
    return item.totalAmount - sumOfSublistValues;
  }

  function CardExample() {
    return (
      <ImageList sx={{ width: "80%", height: "auto" }} cols={4} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=248&fit=crop&auto=format`}
              alt={item.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.name}
              subname={`Remaining: ${calculateRemainingAmount(item)}`}
              actionIcon={
                <IconButton
                  sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                  aria-label={`info about ${item.name}`}
                  onClick={() => setSelectedEvent(item)}
                >
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    );
  }

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      name: 'Breakfast',
      totalAmount:10,
      reservas:[['Juan',2,'2024-01-10'],['Pedro',7,'2024-01-10']]
    },
  ];
  
    
  
  
  
  function ImageData({event}) {
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)',alignItems:'center',justifyContent:'center'}} onClick={handleCloseModal}>
          <MDBContainer style={{alignItems:'center',justifyContent:'center'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' ,width:'40vh',left:'350%'}}>
                  <MDBCardBody className="p-4 text-black" style={{width:'100vh'}}>
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{event.name}</MDBTypography>
                    </div>
                    <div className="d-flex align-items-center mb-4">
                      <div className="flex-shrink-0">
                        <MDBCardImage
                          style={{ width: '90px',height:'80px' }}
                          className="img-fluid rounded-circle border border-dark border-3"
                          src={event.img}
                          alt='Generic placeholder image'
                          fluid />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <div>
                          <MDBBtn outline color="dark" rounded size="sm" className="mx-1"  style={{color: '#424242' }}>Total units {event.totalAmount}</MDBBtn>
                           </div>
                      </div>
                    </div>
                    <hr />
                    <button 
                      onClick={handleCloseModal}
                      className="custom-button-go-back-managing"
                      style={{
                        zIndex: 2,
                        position: 'absolute', 
                        top: '4%',
                        left: '85%', 
                      }}
                    >
                      <CloseIcon sx={{ color: '#F5F5F5' }} />
                    </button>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </div>
    );
  }

  const verifyToken = async (token) => {
    setOpenCircularProgress(true);
    try {
        const decodedToken = jwtDecode(token);
        setUserMail(decodedToken.email);
        setOpenCircularProgress(false);
    } catch (error) {
        console.error('Error al verificar el token:', error);
        setOpenCircularProgress(false);
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
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser();
    }
  }, [userMail]);


  useEffect(() => {
    if(type==='coach' && userMail!=null){
        fetchInventory();
    }
  }, [type])

  const fetchInventory = async () => {
    setOpenCircularProgress(true);
    setOpenCircularProgress(false);
  };

  useEffect(() => {
    if(isSmallScreen400 || isSmallScreen500) {
      setRowsPerPage(10);
    } else {
      setRowsPerPage(5)
    }
  }, [isSmallScreen400, isSmallScreen500, isMobileScreen])

  const fetchUser = async () => {
    setOpenCircularProgress(true);
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
        if(data.type!='coach'){
          navigate('/');
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
  };


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
        <NewLeftBar/>
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <Loader></Loader>
            </Backdrop>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100vh',
            }}
          >
            <CardExample />
            {selectedEvent? (
              <ImageData event={selectedEvent}/>
            ):
            (
              <></>
            )}
          </div>
          
        </>
        )}

    </div>
    
  );
}

export default CouchClasses;
