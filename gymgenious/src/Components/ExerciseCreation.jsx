import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import moment from 'moment'

export default function ExerciseCreation() {
    const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const navigate = useNavigate();

//   const handleCreateClass = async () => {
//     try {  
//       const newClass = {
//         name: name,
//         dateInicio: isoDateStringInicio,
//         dateFin: isoDateStringFin,
//         hour: hour,
//         day: day(date),
//         permanent: permanent,
//       };
  
//       const response = await fetch('http://127.0.0.1:5000/create_class', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newClass),
//       });
  
//       if (!response.ok) {
//         throw new Error('Error al crear la clase');
//       }
  
//       navigate('/', { state: { message: 'block' } });
//       alert("¡Clase creada exitosamente!");
//     } catch (error) {
//       console.error("Error al crear la clase:", error);
//   };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    //handleCreateClass();
  };

  return (
    <div className='App'>
      <LeftBar value={'add'}/>
      <div className='class-creation-container'>
        <div className='class-creation-content'>
          <h2 style={{color:'#14213D'}}>Create exercise</h2>
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
              </div>
            </div>
            <div className="input-container" style={{display:'flex', justifyContent: 'space-between'}}>
                <div className="input-small-container">
                    <label htmlFor="desc" style={{color:'#14213D'}}>Desc:</label>
                    <input 
                    type="text" 
                    id="desc" 
                    name="desc" 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    />
                </div>
            </div>
            <button type="submit" className='button_login'>
              Crear clase
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
