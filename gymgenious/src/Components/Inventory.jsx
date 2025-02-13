import React, {useState, useEffect} from 'react';
import { Box, useMediaQuery } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
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
  const [name, setName] = useState('');
  const [errorNoChange,setErrorNoChange] = useState(false)
  const [total, setTotal] = useState(0);
  const [totalReserved,setTotalReserved] = useState(0)
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [errorTotal,setErrorTotal] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:350px)');
  const isSmallScreen650 = useMediaQuery('(max-width:650px)');
  const isSmallScreen700 = useMediaQuery('(max-width:700px)');
  const [type, setType] = useState(null);
  const [selectedEvent,setSelectedEvent] = useState(null);
  const [itemData,setItemData] = useState([])
  const [id,setId] = useState()
  const [editItem,setEditItem] = useState(false)
  const [editedItem,setEditedItem] = useState(false)
  const [fetchImg, setImageFetch] = useState('')
  const [fetchName,setNameFetch] = useState('')
  const [updatedItems,setUpdatedItemData] = useState([])
  const [fetchTotal,setTotalFetch] = useState(0)
  const [errorCannotDowngradeDueToReservations,setErrorCannotDowngradeDueToReservations] = useState(false)

  function calculateRemainingAmount(item) {
    const sumOfSublistValues = item.reservas.reduce((acc, obj) => acc + obj.cantidad, 0);
    return item.total - sumOfSublistValues;
  }

  const validateForm = () => {
    let res = true
    if ((name==fetchName || name=='') && (total==fetchTotal || total==0) && (!image || image==fetchImg)) {
        res = false
        setErrorNoChange(true)
    } else {
        setErrorNoChange(false)
    }
    if (total<totalReserved) {
      res = false
      setErrorCannotDowngradeDueToReservations(true)
    } else {
      setErrorCannotDowngradeDueToReservations(false)
    }

    return res
  
  
  }


  const saveItem = async (event) => {
    event.preventDefault(); 
    handleSaveEditItem();
    setTimeout(() => {
      setOpenCircularProgress(false);
    }, 7000);
    await fetchInventory(setItemData,setOpenCircularProgress,setWarningConnection);
  }

  const handleSaveEditItem = async () => {
    
    setOpenCircularProgress(true);
    if (validateForm()) {
        try {
            const formData = new FormData();
            formData.append('name', name || fetchName);
            formData.append('total', total || fetchTotal);
            formData.append('image_url', fetchImg);
            formData.append('id',id);
            formData.append('image', image);
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
            }
            const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_item_info', {
                method: 'PUT', 
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Error al actualizar el item: ' + response.statusText);
            }
            setEditedItem(true)
            setEditItem(!editItem);
            handleCloseModal()
            setOpenCircularProgress(false);
            setTimeout(() => {
                setEditedItem(false)
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error("Error actualizarndo el item:", error);
            setOpenCircularProgress(false);
            setWarningConnection(true);
            setTimeout(() => {
            setWarningConnection(false);
            }, 3000);
            setEditItem(!editItem);
        }
    }
}

  const handleEditItem = (event) => {
    setEditItem(!editItem);
    const totalReserved = event.reservas.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    setTotalReserved(totalReserved);
    setImageFetch(event.image_url);
    setNameFetch(event.name);
    setTotal(event.total)
    setTotalFetch(event.total);
    setId(event.id)
  } 

  const handleChangeManteinance= (event) => {    
    setId(event.id)
    fetchChangeManteinance(event)
  }

  const fetchChangeManteinance = async event => {
    setOpenCircularProgress(true);
    try {
        const formData = new FormData();
        formData.append('id',event.id);
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
        const response = await fetch('https://two025-duplagalactica-final.onrender.com/update_item_manteinance', {
            method: 'PUT', 
            headers: {
                'Authorization': `Bearer ${authToken}`
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el item: ' + response.statusText);
        }
        setEditedItem(true)
        setEditItem(!editItem);
        handleCloseModal()
        setOpenCircularProgress(false);
        setTimeout(() => {
            setEditedItem(false)
            window.location.reload();
        }, 2000);
    } catch (error) {
        console.error("Error actualizarndo el item:", error);
        setOpenCircularProgress(false);
        setWarningConnection(true);
        setTimeout(() => {
        setWarningConnection(false);
        }, 3000);
        setEditItem(!editItem);
    }
}

  useEffect(() => {
    if (type!='coach' && type!=null) {
    navigate('/');      
    }
  }, [type]);
  
  useEffect(() => {
    const updatedUrls = itemData.map((item) => ({
      'id':item.id,
      'name':item.name,
      'total': item.total,
      'reservas':item.reservas,
      'mantainance':item.mantainance,
      image_url: `${item.image_url}?t=${new Date().getTime()}`,  
    }));
    setUpdatedItemData(updatedUrls);
  }, [itemData]);  

  function CardExample() {
    return (
      <>
      { updatedItems.length>0 && (
        <div
          style={{
            width: "80%",
            height: "85%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <ImageList sx={{ width: "100%", height: "100%" }} cols={4} gap={8}>
            {updatedItems.map((item) => (
              <ImageListItem key={item.image_url}>
                <img
                  srcSet={`${item.image_url}&w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={item.image_url}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.name}
                  subname={`Remaining: ${calculateRemainingAmount(item)}`}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
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
      )}
      </>
    );
  }
  
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleCloseModalItem = () => {
    setEditItem(false);
  };
  
  function ImageData({event}) {
    return (
      <div className="Modal-Content-view-exercise" style={{position:'fixed',zIndex:1000,display:'flex',flex:1,width:'100%',height:'100%',opacity: 1,
        visibility: 'visible',backgroundColor: 'rgba(0, 0, 0, 0.5)'}} onClick={handleCloseModal}>
          <MDBContainer style={{display:'flex', width: isSmallScreen700 ? '90%' : '85%'}}>
            <MDBRow className="justify-content-center" onClick={(e) => e.stopPropagation()} style={{flex:1,display:'flex',alignContent:'center'}}>
              <MDBCol md="9" lg="7" xl="5" className="mt-5">
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
                          src={`${event.image_url}?t=${new Date().getTime()}`}  
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
                    <button style={{width: isSmallScreen650 ? '70%' : '30%'}} className='BotonEditItemData' onClick={()=> handleEditItem(selectedEvent)}>Edit item</button>
                    {event.mantainance==='no'? (
                        <button style={{width: isSmallScreen650 ? '70%' : isSmallScreen700 ? '30%':'50%',marginLeft: isSmallScreen650 ? '0%' : '10%',marginTop: isSmallScreen650 ? '10%' : '0%'}} className='BotonEditItemData' onClick={()=> handleChangeManteinance(selectedEvent)}>Put on manteinance</button>
                      ) : (
                        <button style={{width: isSmallScreen650 ? '70%' : isSmallScreen700 ? '30%':'50%',marginLeft: isSmallScreen650 ? '0%' : '10%',marginTop: isSmallScreen650 ? '10%' : '0%'}} className='BotonEditItemData' onClick={()=> handleChangeManteinance(selectedEvent)}>Put it available</button>
                      )
                    }
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
        fetchUser(setType,()=>{},userMail,navigate,setWarningConnection)
    }
  }, [userMail]);

  useEffect(() => {
    if(type==='coach' && userMail!=null){
        fetchInventory(setItemData,setOpenCircularProgress,setWarningConnection)
    }
  }, [type])

  return (
    <div className="App">
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
        { editedItem ? (
          <div className='alert-container'>
            <div className='alert-content'>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Slide direction="up" in={editedItem} mountOnEnter unmountOnExit >
                    <Alert style={{fontSize:'100%', fontWeight:'bold'}} icon={<CheckIcon fontSize="inherit" /> } severity="success">
                        Item successfully edited!
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
            { updatedItems.length>0 && updatedItems!=[] && (
              <CardExample />
            )}
            {selectedEvent? (
              <>
              <ImageData event={selectedEvent}/>
              {editItem && (
                <>
                <div className="Modal-edit-routine" onClick={handleCloseModalItem}>
                    <div className="Modal-Content-edit-routine" onClick={(e) => e.stopPropagation()}>
                        <form autoComplete='off' onSubmit={saveItem}>
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
                                    <label htmlFor="total" style={{color:'#14213D'}}>Total:</label>
                                    <input
                                      type="number" 
                                      id="total" 
                                      name="total"
                                      min='0'
                                      max='500'
                                      step='1'
                                      value={total} 
                                      onChange={(e) => setTotal(e.target.value)} 
                                    />
                                    {errorTotal && (<p style={{color: 'red', margin: '0px'}}>Total cannot be 0</p>)}
                                    {errorCannotDowngradeDueToReservations && (<p style={{color: 'red', margin: '0px'}}>Total cannot be lower than the reserved</p>)}
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
                            <button onClick={handleCloseModalItem} className='button_login' style={{marginTop: isSmallScreen650 ? '10px' : '', marginLeft: isSmallScreen650 ? '' : '10px', width: isSmallScreen650 ? '70%' : '30%'}}>Cancel</button>
                        </form>
                    </div>
                </div>
                
                </>
              )}
              </>
            ):
            (
              <></>
            )}
          </div>
          
        </>

    </div>
    
  );
}

export default CouchClasses;
