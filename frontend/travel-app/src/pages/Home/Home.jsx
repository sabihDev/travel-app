import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    try {
      console.log("Fetching user info..."); // Debugging
      const response = await axiosInstance.get('/api/user/get-user');

      if (response.data?.user) {
        setUserInfo(response.data.user);
        console.log(userInfo);
      }


    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    getUserInfo();

    return () =>{
    }
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1"></div>

          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;

