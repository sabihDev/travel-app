import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const PasswordInput = ({ value = "", onChange, placeholder }) => {  // ✅ Default value
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="flex items-center bg-cyan-600/10 px-5 rounded mb-3">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value} // ✅ Ensured it's always controlled
        onChange={onChange ? (e) => onChange(e) : undefined} // ✅ Prevents errors if onChange is missing
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={toggleShowPassword} // ✅ Optimized function call
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={toggleShowPassword} // ✅ Optimized function call
        />
      )}
    </div>
  );
};

export default PasswordInput;
