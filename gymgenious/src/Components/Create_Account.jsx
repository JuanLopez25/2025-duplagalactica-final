import '../App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../routes/users.js';
import LeftBar from '../real_components/LaftBarMaterial.jsx';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccount() {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gym, setGym] = useState('');
    const [errors, setErrors] = useState([]);
    const [errorsModal, setErrorsModal] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const validateForm = () => {
        let errors = [];
        
        if (name === '') {
            errors.push('Please enter a valid name.');
        }

        if (lastName === '') {
            errors.push('Please enter a valid last name.');
        }

        const today = new Date();
        const inputDate = new Date(date);
        if (inputDate >= today || date === '') {
            errors.push('Please enter a valid birthdate.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email.');
        }

        const hasNumber = /[0-9]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length > 7;

        if (!isValidLength) {
            errors.push('The password must be more than 8 characters.');
        } 
        if (!hasNumber) {
            errors.push('The password must contain at least 1 number.');
        } 
        if (!hasLowerCase) {
            errors.push('The password must contain at least 1 lowercase letter.');
        } 
        if (!hasUpperCase) {
            errors.push('The password must contain at least 1 uppercase letter.');
        } 
        if (!hasSpecialChar) {
            errors.push('The password must contain at least 1 special character.');
        }

        if (gym === '') {
            errors.push('Please enter a gym.');
        }

        setErrors(errors);
        return errors.length === 0;
    }

    const handleCreateAccount = async () => {
        if (validateForm()) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const newUser = {
                    uid: firebaseUser.uid,
                    Name: name,
                    Lastname: lastName,
                    Mail: email,
                    Birthday: date,
                    Password: password,
                    Gym: gym,
                };
                await createUser(newUser);
                navigate('/'); 
                alert("Account created successfully!");
            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    alert("An account already exists with this email.");
                } else {
                    console.error("Error creating account:", error);
                    alert("Error creating account");
                }
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreateAccount();
    };

    const handleCloseModal = () => {
        setErrors([])
    }
    return (
        <div className='App'>
            <LeftBar value={'profile'}/>
            <div className='create-account-container'>
                <div className='create-account-content'>
                    <h2 style={{color:'#14213D'}}>Create account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <label htmlFor="name" style={{color:'#14213D'}}>Name:</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="lastName" style={{color:'#14213D'}}>Last name:</label>
                            <input 
                                type="text" 
                                id="lastname" 
                                name="lastname" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="date" style={{color:'#14213D'}}>Birthdate:</label>
                            <input 
                                type="date" 
                                id="date" 
                                name="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="email" style={{color:'#14213D'}}>Email:</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="password" style={{color:'#14213D'}}>Password:</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="gym" style={{color:'#14213D'}}>Gym:</label>
                            <input 
                                type="text" 
                                id="gym" 
                                name="gym" 
                                value={gym} 
                                onChange={(e) => setGym(e.target.value)} 
                            />
                        </div>
                        <button type="submit" className='button_create_account'>
                            Crear cuenta
                        </button>
                    </form>
                </div>
            </div>
            {errors.length > 0 && (
                <div className="errorsCreateAccountModal" onClick={handleCloseModal}>
                    <div className="errorsCreateAccountContentModal" onClick={handleCloseModal}>
                        <ul>
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
