import React, {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import CloseIcon from '@mui/icons-material/Close';
import fetchInventory from '../fetchs/fetchInventory.jsx'
import fetchUser from '../fetchs/fetchUser.jsx';
import verifyToken from '../fetchs/verifyToken.jsx';



function CouchClasses() {
  const [userMail,setUserMail] = useState(null)
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:700px)');
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const [itemData,setItemData] = useState([])

  function calculateRemainingAmount(item) {
    const sumOfSublistValues = item.reservas.reduce((acc, obj) => acc + obj.cantidad, 0);
    return item.total - sumOfSublistValues;
  }

  useEffect(() => {
    if (type!='coach' && type!=null) {
    navigate('/');      
    }
  }, [type]);

  function CardExample() {
    return (
      <div
        style={{
          width: "80%",
          height: "85%", 
          overflowY: "auto", 
          overflowX: "hidden",
        }}
      >
        <ImageList sx={{ width: "100%", height: "auto" }} cols={4} gap={8}>
          {itemData.map((item) => (
            <ImageListItem key={item.image_url}>
              <img
                srcSet={`${item.image_url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.image_url}?w=248&fit=crop&auto=format`}
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
      </div>
    );
  }
  
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };
  
  function ImageData({event}) {
    return (
      <div className="vh-100" style={{position:'fixed',zIndex:1000,display:'flex',width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)',alignItems:'center',justifyContent:'center'}} onClick={handleCloseModal}>
           <MDBContainer style={{display:'flex'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5" style={{width:'20%'}}>
                <MDBCard style={{ borderRadius: '15px', backgroundColor: '#F5F5F5' }}>
                  <MDBCardBody className="p-4 text-black">
                    <div>
                      <MDBTypography tag='h6' style={{color: '#424242',fontWeight:'bold' }}>{event.name}</MDBTypography>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mb-4" style={{ alignItems: 'center' }}>
                      <div className="position-relative d-inline-block" style={{ width: '10vh', height: '10vh' }}>   
                        <MDBCardImage
                          style={{ width: '100%',height:'100%' }}
                          className="img-fluid rounded-circle border border-dark border-3"
                          src={event.image_url}
                          alt='Generic placeholder image'
                          fluid />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3 text-center">
                      <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                        <p className="mb-0 me-2" style={{ color: '#424242' }}>
                          Total units: {event.total}
                        </p>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3 text-center">
                      <div className="d-flex flex-row align-items-center justify-content-center mb-2">
                        <p className="mb-0 me-2" style={{ color: '#424242' }}>
                        Remaining units: {calculateRemainingAmount(event)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleCloseModal}
                      className="custom-button-go-back-managing"
                      style={{
                        zIndex: '2',
                        position: 'absolute', 
                        top: '2%',
                        left: isSmallScreen ? '78%' : '80%',
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
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,()=>{},setUserMail,setErrorToken);
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser(setType,()=>{},userMail,navigate)
    }
  }, [userMail]);

  useEffect(() => {
    if(type==='coach' && userMail!=null){
        fetchInventory(setItemData,setOpenCircularProgress,setWarningConnection)
    }
  }, [type])

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
