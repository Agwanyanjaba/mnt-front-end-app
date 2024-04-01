"use client"

import React, { useState } from 'react';
import CustomTextField from '../components/shared/CustomTextField';
import CustomButton from '../components/shared/CustomButton';
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleGetStartedClick = () => {
    // Optional: Perform any necessary actions before navigation
    console.log('=User Email:', username);
    router.push('/payment-info'); // Navigate to PaymentInfo page
  };


  return (
    <form className="flex flex-col justify-center items-center min-h-screen relative">
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
        <CustomButton type="button" label="Get Started" onClick={handleGetStartedClick} />
      </div>
    </form>
  );
};

export default LoginForm;
