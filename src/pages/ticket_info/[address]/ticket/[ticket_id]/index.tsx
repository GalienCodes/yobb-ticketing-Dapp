"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { displayData, truncate, useGlobalState } from 'store';
import { fetchInfo, getMyTickets } from '@/Blockchain';
import Image from 'next/image';

const TicketInfo = () => {
  const [connectedAccount] = useGlobalState('connectedAccount');
  const router = useRouter();
  const { address, ticket_id } = router.query;
  const [qr_code] = useGlobalState('qr_code');
  const [singleTicket] = useGlobalState('singleTicket');

  // fetch information about a ticket
  useEffect(() => {
    const loadData = async () => {
      await getMyTickets();
      await fetchInfo(ticket_id);
    };
    loadData();
  }, [ticket_id]);
console.log(singleTicket);
console.log(ticket_id);

  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto '>
      <div className='flex gap-4 flex-col justify-center  mx-4 sm:flex-row'>
        <div className='flex flex-col bg-gray-50 rounded-md  pt-4'>
          <Image
            src={qr_code}
            className='rounded-md  w-full'
            width={100}
            height={100}
            alt='QR code of a ticket'
          />
        </div>
        <div className='flex gap-4 flex-col justify-center mx-4 sm:flex-row items-center text-gray-50'>
          <div className='flex flex-col'>
            <h1 className='text-md font-medium text-gray-50 capitalize '>
              Ticket #:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {Number(singleTicket?.ticketId)}
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              event Id #:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {Number(singleTicket?.eventId)}
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              category:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {singleTicket?.category}
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              Ticket Price:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {Number(singleTicket?.ticketPrice)} CELO
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              event Title:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {singleTicket?.eventTitle}
              </span>
            </h1>

            <h1 className='text-md font-mediumcapitalize '>
              Client:
              <span className='ml-2 text-md font-medium text-black'>
                {truncate(address, 6, 6, 15)}
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              event Date:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {displayData(singleTicket?.eventDate)}
              </span>
            </h1>
            <h1 className='text-md font-mediumcapitalize '>
              event Venue:
              <span className='ml-2 text-md font-medium text-black'>
                 {/* @ts-ignore  */}
                {singleTicket?.eventVenue}
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfo;
