'use client';
import React, { useEffect, useState } from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import { TbExternalLink } from 'react-icons/tb';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import { useRouter } from 'next/router';
import { displayData, setGlobalState, useGlobalState } from 'store';
import {
  TicketNFTAddress,
  mintsByUser,
  renderQRcode,
  safeMint,
  uploadJson,
  uploadTicketImage,
} from '@/Blockchain';
import { toast } from 'react-hot-toast';
import ShowRQ from '../ShowRQ';

interface ITicketCard {
  category: string;
  eventDate?: number | undefined;
  eventTitle: string;
  ticketId: number;
  ticketPrice: string;
  eventVenue: string;
  eventId: number;
  completed: boolean;
  owner: string;
}

const TicketCard = ({
  category,
  eventDate,
  eventVenue,
  eventTitle,
  ticketId,
  ticketPrice,
}: ITicketCard) => {
  const router = useRouter();
  const [connectedAccount] = useGlobalState('connectedAccount');
  const [minted, setMinted] = useState([]);
  
  // watch qr code button event
  //@ts-ignore
  const watchQRcode = async (ticketId) => {
    //@ts-ignore
    setGlobalState('qr_code',await renderQRcode(Number(ticketId), 'data'));
  };
  // mint nft event
  const mintNFT = async (ticketId: number) => {
    // upload ticket qr code image to pinata
    // it have been already uploaded so pinata does not upload it again
    // and only returns it's ipfs hash
    const image_hash = await uploadTicketImage(ticketId);

    // get uploaded metadata hash
    const meta_hash = await uploadJson(ticketId, image_hash);

    toast('Loading, please wait..');

    // mint nft with specific ipfs gateway url
    if (
      await safeMint(ticketId, `https://gateway.pinata.cloud/ipfs/${meta_hash}`)
    )
      await fetchMinted();
  };

  // fetch minted nfts by user
  const fetchMinted = async () => {
    const mints = await mintsByUser();
    setMinted(mints);
  };
  // render button on ticket
    //@ts-ignore
  const renderButton = (ticketId) => {
    //@ts-ignore
    const search = minted.find((value) => value.ticket_id === ticketId);

    if (search) {
      return (
        <a
          className='w-40 flex justify-between items-center px-3 py-1 bg-[#000] text-center text-gray-50 text-base   rounded-2xl hover:bg-gray-700 hover:border-none shadow-xl font-medium'
          href={`https://explorer.celo.org/alfajores/token/${TicketNFTAddress.toLowerCase()}/instance/${
            //@ts-ignore
            search.token_id
          }`}
          target='_blank'
        >
          View Ticket <TbExternalLink/>
        </a>
      );
    } else {
      return (
        <button
          className='w-40 bg-gray-700 text-gray-50 text-base py-1 rounded-2xl hover:bg-gray-400 hover:border-none shadow-xl font-medium'
          onClick={() => {
            mintNFT(ticketId);
          }}
        >
          Mint Ticket
        </button>
      );
    }
  };

  useEffect(() => {
    fetchMinted();
  }, [connectedAccount,ticketId]);
  return (
    <div className='bg-[#2db369] shadow-md rounded  text-white'>
      <div className='flex gap-4 h-52'>
        <div className='flex flex-col gap-2 w-5/12  sm:w-2/5  bg-[#000] justify-center items-center'>
          <FaTicketAlt className='text-5xl' />
          <h4 className='text-sm font-semibold'>
            {category && category} Ticket
          </h4>
        </div>
        <div className=' flex flex-col pb-2 gap-0.5 w-7/12 sm:w-3/5 justify-center'>
          <div className='flex justify-between items-center'>
            <h2 className=' font-semibold text-lg py-0'>
              {eventTitle && eventTitle}
            </h2>
            <p className='mr-4 font-bold'># {Number(ticketId)}</p>
          </div>
          <h2 className='text-sm font-medium'>
            {' '}
            Ticket price{' '}
            <span className='font-bold'>{ticketPrice && ticketPrice} CELO</span>
          </h2>
          <h2 className='text-sm font-medium'>
            Event Date{' '}
            <span className='font-semibold bg-[#fff] px-2 py-1 rounded-xl text-gray-800'>
              {displayData(eventDate && eventDate)}
            </span>
          </h2>
          <h2 className='text-sm font-medium flex items-center'>
            Venue: <HiOutlineLocationMarker className='mx-1' />
            <span className='font-bold'> {eventVenue && eventVenue}</span>
          </h2>
          <div className='flex  justify-between'>
            <button
              className='w-40 my-2 py-1 bg-[#fff] text-gray-800 text-base rounded-2xl hover:bg-gray-100 hover:border-none shadow-xl font-semibold'
              onClick={() => {
                watchQRcode(ticketId);
                setGlobalState('modalQr', 'scale-100');
              }}
            >
              Watch QR
            </button>
          </div>
          {renderButton(ticketId)}
        </div>
      </div>
      <ShowRQ />
    </div>
  );
};

export default TicketCard;
