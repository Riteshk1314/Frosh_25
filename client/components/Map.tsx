import React from 'react'

const Map = () => {
  return (
    <div className='w-[100vw] h-[90vh] flex flex-col justify-center gap-10 border-y-2 border-[#ffffff70] items-center bg-[#0000CB7] backdrop-blur-xl mt-10 md:mt-0'>
        <h2 className='text-center text-white text-[5vw] mt-10 md:mt-0 md:text-[2vw] font-bold'>MAP</h2>
        <img src="/Map.svg" alt="thapar Map" className='md:rotate-0 rotate-90 h-[100vh] w-[100vw] md:w-[70vw] md:h-[70vh]' />
    </div>
  )
}

export default Map