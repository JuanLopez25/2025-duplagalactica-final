import '../App.css';
import React, { useState,useEffect  } from 'react';
import { useMotionValue, motion } from "framer-motion";
import { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import ExerciseCreation from './ExerciseCreation.jsx'
import RoutineCreation from './RoutineCreation.jsx'
import AssignRoutineToUser from './AssignRoutineToUser.jsx'
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Inventory from './InventoryCreation.jsx'
import verifyToken from '../fetchs/verifyToken.jsx';
import fetchUser from '../fetchs/fetchUser.jsx';
import Box from '@mui/material/Box';
import Loader from '../real_components/loader.jsx'

const Link = ({ heading, subheading, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.a
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial="initial"
      whileHover="whileHover"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #F5F5F5', 
        padding: '1rem 0', 
        transition: 'color 0.5s', 
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = '#f9fafb')}
    >
  <div>
    <motion.span
      variants={{
        initial: { x: 0 },
        whileHover: { x: -16 },
      }}
      transition={{
        type: 'spring',
        staggerChildren: 0.075,
        delayChildren: 0.25,
      }}
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'block',
        fontSize: '2rem', 
        fontWeight: 'bold',
        color: '#48CFCB',
        transition: 'color 0.5s', 
      }}
    >
      {heading.split("").map((l, i) => (
        <motion.span
          variants={{
            initial: { x: 0 },
            whileHover: { x: 16 },
          }}
          transition={{ type: 'spring' }}
          style={{ display: 'inline-block' }}
          key={i}
        >
          {l}
        </motion.span>
      ))}
    </motion.span>
    <span
      style={{
        position: 'relative',
        zIndex: 10,
        marginTop: '0.5rem', 
        display: 'block',
        fontSize: '1rem', 
        color: '#229799',
        transition: 'color 0.5s', 
      }}
    >
      {subheading}
    </span>
  </div>

  

  <motion.div
    variants={{
      initial: {
        x: '25%',
        opacity: 0,
      },
      whileHover: {
        x: '0%',
        opacity: 1,
      },
    }}
    transition={{ type: 'spring' }}
    style={{
      position: 'relative',
      zIndex: 10,
      padding: '1rem', // p-4
    }}
  >

    <FiArrowRight style={{ fontSize: '2.5rem', color: '#48CFCB' }} />
  </motion.div>
</motion.a>

  );
};


export default function ManagingRoutines () {
  const [userMail,setUserMail] = useState('')
  const [errorToken,setErrorToken] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const [type, setType] = useState(null);

  useEffect(() => {
    if (type!='coach' && type!=null) {
      navigate('/');      
    }
  }, [type]);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
        verifyToken(token,setOpenCircularProgress,setUserMail,setErrorToken);
    } else {
        navigate('/');
        console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userMail) {
        fetchUser(setType,setOpenCircularProgress,userMail,navigate);
    }
  }, [userMail]);

  const handleLinkClick = (component) => {
    setActiveComponent(component);
  };
  
  return (
  <div className='full-screen-image-3'>
      {type!='coach' ? (
          <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={true}
          >
              <CircularProgress color="inherit" />
          </Backdrop>
      ) : (
          <>
            <NewLeftBar/>
            {activeComponent? (
              <></>
            ) : (
            <section style={{alignContent:'center', backgroundColor: '', padding: '16px' }}>
              <div>
                <Link
                  heading="Exercises"
                  subheading="Create your own exercises"
                  onClick={() => handleLinkClick(<ExerciseCreation />)}
                />
                <Link
                  heading="Routines"
                  subheading="Create your routines"
                  onClick={() => handleLinkClick(<RoutineCreation />)} 
                />
                <Link
                  heading="Assigments"
                  subheading="Assign routine to users"
                  onClick={() => handleLinkClick(<AssignRoutineToUser />)}
                />
                <Link
                  heading="Inventory"
                  subheading="Add inventory so then other coaches can use it"
                  onClick={() => handleLinkClick(<Inventory />)}
                />
              </div>
            </section>
            )} 
            <div>
              {activeComponent} 
            </div>
          </>
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
      {openCircularProgress ? (
          <Backdrop open={openCircularProgress} sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}>
              <Loader></Loader>
          </Backdrop>
      ) : (
          null
      )}
  </div>
  );
}
