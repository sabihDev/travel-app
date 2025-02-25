import React, { useEffect } from 'react'
import { getInitials } from '../../utils/helper.js';

const ProfileInfo = ({userInfo, onLogout}) => {
    useEffect(()=>{
        console.log(userInfo);
    },[]);
  return (
    userInfo && (<div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
        {getInitials(userInfo ? userInfo.fullName : "WJ")}
      </div>

      <div>
        <p className='text-sm font-medium'>{userInfo.fullName ||"sdhg"}</p>
        <button className='text-sm text-slate-700 underline' onClick={onLogout}>
            Logout
        </button>
      </div>
    </div>)
  )
}

export default ProfileInfo
