import React, {useState, useEffect} from 'react';
import { Box } from '@mui/material';
import NewLeftBar from '../real_components/NewLeftBar'
import { useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Loader from '../real_components/loader.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import CustomTable from '../real_components/Table3columns.jsx';
import verifyToken from '../fetchs/verifyToken.jsx'
import fetchUser from '../fetchs/fetchUser.jsx'
import fetchAssistance from '../fetchs/fetchAssistance.jsx';

function CouchClasses() {
  const [userMail,setUserMail] = useState(null)
  const navigate = useNavigate();
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const [warningConnection, setWarningConnection] = useState(false);
  const [errorToken,setErrorToken] = useState(false);
  const [type, setType] = useState(null);
  const [newRows, setNewRows] = useState([]);

  useEffect(() => {
    if (type!='coach' && type!=null) {
    navigate('/');      
    }
  }, [type]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken)
    } else {
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail,navigate,setWarningConnection)
    }
  }, [userMail]);

  useEffect(() => {
    if(type==='coach' && userMail!=null){
        fetchAssistance(setOpenCircularProgress,setNewRows,setWarningConnection,userMail)
    }
  }, [type])

  const handleSelectEvent = () => {
    return
  }


  return (
    <div className="App">
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
          <>
        <NewLeftBar/>
        {openCircularProgress ? (
            <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
                <Loader></Loader>
            </Backdrop>
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
        {newRows && (
              <CustomTable columnsToShow={['Assisted class','Assisted date','Student','There are users that take assist to your classes']} data={newRows} handleSelectEvent={handleSelectEvent} vals={['className','fecha','MailAlumno']}/> 
        )}
        </>

    </div>
    
  );
}

export default CouchClasses;
