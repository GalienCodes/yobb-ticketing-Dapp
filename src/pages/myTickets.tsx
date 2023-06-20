'use-client';
import TicketCard from '@/components/cards/TicketCard';
import React, { useEffect } from 'react';
import { useGlobalState } from 'store';

const MyTickets = () => {
  const [myTickets] = useGlobalState('myTickets');
  
  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto text-gray-50'>
      <div className='pb-12 sm:pb-14 text-white'>
        <h2 className='font-semibold text-2xl text-center'>
          My tickets
        </h2>
      </div>
      <div className='mx-4 grid grid-cols-1  gap-2 sm:grid-cols-2 sm:gap-4'>
      {myTickets.length > 0 ? (
        myTickets?.map((item: { ticket: { category: any; eventDate: any; eventId: any; eventTitle: any; eventVenue: any; sold: any; ticketId: any; ticketPrice: any; }; }, i: number) => {
          const {
            category,
            eventDate,
            eventId,
            eventTitle,
            eventVenue,
            ticketId,
            ticketPrice,
            //@ts-ignore
          } = item?.ticket;
          return (
            //@ts-ignore
              <TicketCard
                category={category}
                eventDate={eventDate}
                eventVenue={eventVenue}
                eventId={eventId}
                eventTitle={eventTitle}
                ticketId={ticketId}
                ticketPrice={ticketPrice}
                key={i + 1}
              />
          );
        })
      ) : (
        <p className='font-bold text-center pt-5'>You do not have any yet!</p>
      )}
        
      </div>
    </div>
  );
};

export default MyTickets;