import React from 'react';

// Define prop types for CustomButton
interface CustomButtonProps {
  type: 'submit' | 'button' | 'reset' | undefined;
  label: string;
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ type, label, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="col-span-3 gap-1 items-center border-[1px] border-slate-700 rounded-full overflow-hidden px-8 py-3.5 text-white cursor-pointer text-xl bg-red-600"
    >
      {label}
    </button>
  );
};

export default CustomButton;
