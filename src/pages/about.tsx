import React from 'react';
import { AiFillLinkedin } from 'react-icons/ai';
import { useState } from 'react';
import { ethers } from 'ethers';

const About = () => {
  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto text-white'>
      <div className=' mx-4'>
        <h2 className='font-semibold text-2xl'>About the App</h2>
        <div className='py-4'>
          <h2 className='text-sm text-white'>
            <span className='font-black text-3xl mr-2'>Yob</span> a
            revolutionary ticket booking Dapp that leverages blockchain
            technology to offer secure, fast, and decentralized transactions for
            online ticket bookings. By utilizing Non-Fungible Tokens (NFTs) with
            auto-generated QR codes, Yob ensures the authenticity and uniqueness
            of each ticket.
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-3 '>
          <div className='text-sm rounded p-4 bg-[#2db369] shadow-md'>
            <h1 className='bg-[#2db369] text-gray-50 w-10 h-10 text-center p-2 rounded-full mb-2  text-xl font-bold shadow-lg'>
              1
            </h1>
            <p>
              With Yob, users can easily browse and explore a wide range of
              events and conveniently purchase tickets directly through the
              smart contract. All transactions are recorded on the blockchain,
              providing transparency and immutability. This eliminates the need
              for intermediaries, reducing costs and streamlining the ticketing
              process.
            </p>
          </div>
          <div className='text-sm rounded p-4 bg-[#2db369] shadow-md'>
            <h1 className='bg-[#2db369] text-gray-50 w-10 h-10 text-center p-2 rounded-full mb-2  text-xl font-bold shadow-lg'>
              2
            </h1>
            <p>
              Event organizers can effortlessly add event details such as ticket
              prices and the number of available tickets. Yob empowers
              organizers with a user-friendly interface to manage their events,
              ensuring accurate tracking and efficient ticket distribution.
            </p>
          </div>
          <div className='text-sm rounded p-4 bg-[#2db369] shadow-md'>
            <h1 className='bg-[#2db369] text-gray-50 w-10 h-10 text-center p-2 rounded-full mb-2 text-xl font-bold shadow-lg'>
              3
            </h1>
            <p>
              In addition, Yob integrates with Celo Explore, allowing users to
              view the minted NFT tickets and verify their authenticity. This
              further enhances trust and security in the ticketing ecosystem.
            </p>
          </div>
        </div>
        <div className='flex py-2 sm:py-4 justify-center items-center text-sm '>
          <a href='https://www.linkedin.com/in/muhindo-galien/' target='_blank'>
            <h2 className='flex items-center cursor-pointer'>
              Developed by: Muhindo Galien{' '}
              <AiFillLinkedin className='text-xl font-bold text-black' />
            </h2>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
