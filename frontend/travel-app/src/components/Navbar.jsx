import React from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";


const Navbar = ({userInfo}) => {
  const navigate = useNavigate();
  const isToken = localStorage.getItem("token");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <div className="bg-white flex items-center justify-between px-6 py-3 drop-shadow sticky top-0 z-10">
      {/* Logo */}
      <div className="logo text-5xl font-bold text-[#18b1b1]">Travel Story</div>

      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>}

      {/* Navigation Links (Add as needed) */}
      {/* <nav>
        <ul className="flex gap-6 text-gray-700 font-medium">
          <li className="cursor-pointer hover:text-cyan-600 transition">Home</li>
          <li className="cursor-pointer hover:text-cyan-600 transition">About</li>
          <li className="cursor-pointer hover:text-cyan-600 transition">Contact</li>
        </ul>
      </nav> */}
    </div>
  );
};

export default Navbar;
