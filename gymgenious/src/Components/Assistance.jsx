import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Box} from '@mui/material';
import Loader from '../real_components/loader.jsx';
import NewLeftBar from '../real_components/NewLeftBar';
import verifyToken from '../fetchs/verifyToken.jsx';
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import fetchUser from '../fetchs/fetchUser.jsx';

const QRScanner = () => {
  const scannerRef = useRef(null);
  const [errorToken,setErrorToken] = useState(false);
  const navigate = useNavigate();    
  const [openCircularProgress, setOpenCircularProgress] = useState(false);  
  const [type, setType] = useState(null);
  const [userMail, setUserMail] = useState('');
  const [warningConnection, setWarningConnection] = useState(false);

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
    if (type!='client' && type!=null) {
    navigate('/');      
    }
  }, [type]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (decodedText) => {
        if (isValidURL(decodedText)) {
          window.location.href = decodedText;
        } else {
          alert("El código escaneado no es un enlace válido: " + decodedText);
        }
        scanner.clear();
      },
      (error) => {
        console.log(error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear();
    };
  }, []);

  const isValidURL = (text) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <>
    <NewLeftBar/>
    {openCircularProgress && (
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={openCircularProgress}>
            <Loader></Loader>
        </Backdrop>
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
    <div className='App' style={styles.container}>
      
      <h2 style={styles.title}>QR Scanner</h2>
      <div id="reader" style={styles.scanner}></div>
    </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#121212",
  },
  title: {
    color: "white",
    marginBottom: "20px",
  },
  scanner: {
    filter: "invert(1)",
  },
};

export default QRScanner;
