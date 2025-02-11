import '../App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import verifyToken from '../fetchs/verifyToken.jsx';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Loader from '../real_components/loader.jsx';
import fetchUser from '../fetchs/fetchUser.jsx';
import NewLeftBar from '../real_components/NewLeftBar.jsx';


export default function ExerciseCreation() {
  const [name, setName] = useState('');
  const [total, setTotal] = useState(0);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [userMail,setUserMail] = useState(null);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [type, setType] = useState(null);
  const [errorToken,setErrorToken] = useState(false);
  const [errorName,setErrorName] = useState(false)
  const [errorDesc,setErrorDesc] = useState(false)
  const [errorImage,setErrorImage] = useState(false)


  useEffect(() => {
    if (userMail) {
        fetchUser(setType,()=>{},userMail,navigate,setWarningConnection)
    }
  }, [userMail]);

  const validateForm = () => {
      let res = true
      if (name === '') {
        setErrorName(true)
        res = false
      } else {
        setErrorName(false)
      }
  
      if (total==0) {
        setErrorDesc(true)
        res = false
      } else {
        setErrorDesc(false)
      }
  
      if (!image) {
        setErrorImage(true);
        res = false
      } else {
        setErrorImage(false)
      }

      return res
  }

  const handleCreateExersice = async () => {
      setOpenCircularProgress(true);
      if(validateForm()){
        try {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('total', total);
          if (image) {
              formData.append('image', image);
          }
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            console.error('Token no disponible en localStorage');
            return;
          }
          const response = await fetch('https://two025-duplagalactica-final.onrender.com/create_inventory', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Error al crear ejercicio');
          }
          setOpenCircularProgress(false);
          setSuccess(true);
          setTimeout(() => {
              setSuccess(false);
              window.location.reload()
          }, 3000);
        } catch (error) {
          console.error("Error al crear el ejercicio:", error);
          setOpenCircularProgress(false);
          setFailure(true);
          setTimeout(() => {
              setFailure(false);
          }, 3000);
      }
    } else {
      setOpenCircularProgress(false);
    }
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateExersice();
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (type!='coach' && type!=null) {
    navigate('/');      
    }
  }, [type]);

  return (
    <div className='App'>
    <NewLeftBar />
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
    <div className='exercise-creation-container'>
      <div className='exercise-creation-content'>
        <h2 style={{color:'#14213D'}}>Add items</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
            <div className="input-small-container">
              <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              {errorName && (<p style={{color: 'red', margin: '0px'}}>There is no name</p>)}
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
                  {errorDesc && (<p style={{color: 'red', margin: '0px'}}>Total cannot be 0</p>)}
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
              {errorImage && (<p style={{color: 'red', margin: '0px'}}>There are images uploaded</p>)}
            </div>
          </div>
          <button type="submit" className='button_login'>
            Create exercise
          </button>
        </form>
      </div>
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
                      Exercise successfully created!
                  </Alert>
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
                      <Alert style={{fontSize:'100%', fontWeight:'bold'}} severity="info">
                          Error creating exercise. Try again!
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
    </div>
    </div>
  );
}
