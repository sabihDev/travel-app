import React from 'react'
import { getEmptyCardIcon } from '../../utils/helper';

const EmptyCard = ({imgSrc, message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
      <div className='bg-cyan-100 border border-cyan-500 rounded-full p-5'>
        {getEmptyCardIcon(imgSrc)}
      </div>

      <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
        {message}
      </p>
    </div>
  )
}

export default EmptyCard
