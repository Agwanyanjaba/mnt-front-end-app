"use client"

import React, { useState } from 'react';
import CustomTextField from '../components/shared/CustomTextField';
import CustomButton from '../components/shared/CustomButton';

const LoginForm = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here (e.g., send data to backend)
    console.log('Login submitted:', username);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center min-h-screen relative">
      <div className="background-container absolute inset-0 w-full h-full z-0">
        <img src="/images/home.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Background" />
      </div>
      <div className="z-10 grid grid-cols-10 gap-2">    
        <CustomTextField
          type="text"
          placeholder="Enter Your Gmail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <CustomButton type="submit" label="Get Started" />
      </div>
    </form>
  );
};

export default LoginForm;
