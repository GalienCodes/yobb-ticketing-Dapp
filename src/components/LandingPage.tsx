'use client';
import React, { useReducer } from 'react';
import Hero from './Hero';
import { useGlobalState } from 'store';
import Events from './AllEvents';

const LandingPage = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');

  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto'>
      <Hero />
      <div className='pb-10 sm:pb-10 text-white'>
        {connectedAccount ? (
          <h2 className='font-semibold mx-4 pt-4 sm:mx-6 lg:mx-0 text-2xl text-center sm:text-left'>
            Latest events
          </h2>
        ) : (
          <p className='w-10/12 sm:w-4/12 mx-auto a font-bold text-center p-5 bg-[#2db369] shadow-md rounded'>
            Please, Connecte Your Coinbase wallet!
          </p>
        )}
      </div>
      {connectedAccount.length > 0 ? (
      <div className=' sm:mx-6 lg:mx-0'>
        <Events />
      </div>):null}
    </div>
  );
};

export default LandingPage;
