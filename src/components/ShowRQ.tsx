import Image from 'next/image';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { setGlobalState, useGlobalState } from 'store';

const ShowRQ = () => {
  const [modalQr] = useGlobalState('modalQr');
  const [qr_code] = useGlobalState('qr_code');
  const closeModal = () => {
    setGlobalState('modalQr', 'scale-0');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-30
    flex items-center justify-center bg-black bg-opacity-20 
    transform duration-300 font-globalFont ${modalQr}`}
    >
      <div className='w-6/12 md:w-2/12 h-6/12 p-4  shadow-sm rounded  px-3 bg-white '>
        <div className='flex items-center justify-between'>
          <p></p>
          <button type='button' onClick={closeModal}>
            <AiOutlineCloseCircle className='font-bold text-black text-2xl ' />
          </button>
        </div>
        <Image
          src={qr_code}
          className='w-full'
          width={200}
          height={200}
          alt='QR code of a ticket'
        />
      </div>
    </div>
  );
};

export default ShowRQ;
