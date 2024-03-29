import React from 'react';

// Define prop types for CustomTextField
interface CustomTextFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder} // Use placeholder prop here
      value={value}
      onChange={onChange}
      className="col-span-7 border-[1px] border-slate-700 rounded-full overflow-hidden px-2 py-1 text-black lg:w-[500px]"
    />
  );
};

export default CustomTextField;

