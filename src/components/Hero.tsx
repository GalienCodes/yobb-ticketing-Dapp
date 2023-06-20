import React, { useReducer } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { initialState, reducer } from './NavBar';
import { setGlobalState, useGlobalState } from 'store';
function Hero() {
  const [connectedAccount] = useGlobalState('connectedAccount');

  return (
    <div className='ms:pt-6 max-w-4xl mx-auto text-gray-50 '>
      <div className='mx-4 sm:mx-6 lg:mx-0'>
        <div className='flex flex-col sm:flex-row  items-center justify-between gap-4'>
          <div className='text-center sm:text-left w-full sm:w-4/5'>
            <h1 className='font-bold text-4xl lg:text-5xl pb-4'>
              We make it easier
            </h1>
            <h4 className='text-base sm:text-lg font-bold sm:font-bold capitalize '>
              Secured and Fast booking
            </h4>
            <p className='text-sm sm:text-base'>
              Experience the power of decentralized technology with Reserve.
              Your one-stop-shop for all ticket needs. The quickest way to book
              tickets.
            </p>
            <div className='flex gap-4 my-4 justify-center sm:justify-start'>
              {connectedAccount && connectedAccount ? (
                <button
                  className='px-4 py-2 rounded cursor-pointer bg-gray-900 text-white'
                  type='button'
                  onClick={() => {
                    setGlobalState('modal', 'scale-100');
                  }}
                >
                  Add Event
                </button>
              ) : (
                <button
                  disabled
                  className='px-4 py-2 rounded bg-gray-900 text-white'
                  type='button'
                >
                  Add Event
                </button>
              )}
            </div>
          </div>
          <Image
            src='/ticket.webp'
            height={380}
            width={380}
            alt='fanacial-wallet'
            className='order-first sm:order-last'
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
