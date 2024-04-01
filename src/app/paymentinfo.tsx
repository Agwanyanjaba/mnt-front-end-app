"use client"

import React, { useState } from 'react';
import CustomTextField from '../components/shared/CustomTextField';
import CustomButton from '../components/shared/CustomButton';
import Link from "next/link";

const PaymentInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    // Handle login logic here (e.g., send data to backend)
    console.log('Login submitted:', phoneNumber);
  };

  return (
    <form className="flex flex-col justify-center items-center min-h-screen relative">
      <div className="background-container absolute inset-0 w-full h-full z-0">
        <img src="/images/home.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Background" />
      </div>
      <div className="z-10 grid grid-cols-10 gap-2">    
        <CustomTextField
          type="text"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <CustomButton type="submit" label="Susbcribe" onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default PaymentInfo;
