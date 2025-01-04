import '../App.css';
import React, { useState,useEffect  } from 'react';
import { useMotionValue, motion, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/NewLeftBar.jsx';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import NewLeftBar from '../real_components/NewLeftBar.jsx';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ExerciseCreation from './ExerciseCreation.jsx'
import RoutineCreation from './RoutineCreation.jsx'
import AssignRoutineToUser from './AssignRoutineToUser.jsx'
import {jwtDecode} from "jwt-decode";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';


const Link = ({ heading, subheading, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const top = useTransform(mouseYSpring, [0.5, -0.5], ["40%", "60%"]);
  const left = useTransform(mouseXSpring, [0.5, -0.5], ["60%", "70%"]);

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
  const step = 0;
  const [activeStep, setActiveStep] = React.useState(step);
  const [skipped, setSkipped] = React.useState(new Set());
  const [errorToken,setErrorToken] = useState(false);
  const [openCircularProgress, setOpenCircularProgress] = useState(false);
  const steps = ['Create exercise', 'Create routine', 'Assign routine'];
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);
  const [type, setType] = useState(null);

    const isStepOptional = () => {
        return true;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
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

  useEffect(() => {
    if (userMail) {
        fetchUser();
    }
}, [userMail]);

  const fetchUser = async () => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.error('Token no disponible en localStorage');
          return;
        }
      const encodedUserMail = encodeURIComponent(userMail);
      const response = await fetch(`https://two025-duplagalactica-final.onrender.com/get_unique_user_by_email?mail=${encodedUserMail}`
        , {
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

  const verifyToken = async (token) => {
      try {
          const decodedToken = jwtDecode(token);
          setUserMail(decodedToken.email);
      } catch (error) {
          console.error('Error al verificar el token:', error);
          throw error;
      }
  };
  
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
              </div>
            </section>
            )} 
            <div>
              {activeComponent} 
            </div>
          </>
      )}  
  </div>
  );
}
