import EventCard from '@/components/cards/EventCard';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useGlobalState } from 'store';

const MyEvents = () => {

  const [myEvents] = useGlobalState('myEvents');
  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto'>
      <div className='pb-12 sm:pb-14 text-white'>
        <h2 className='font-semibold text-2xl text-center'>My events</h2>
      </div>
      <div className='mx-4 grid grid-cols-1  gap-2 sm:grid-cols-2 sm:gap-4'>
        {myEvents.length > 0 ? (
          myEvents?.map((item, i) => {
            const {
              eventId,
              eventDate,
              owner,
              eventName,
              numSilverTickets,
              numVipTickets,
              sellingDuration,
              silverTicketPrice,
              vipTicketPrice,
              vipTickets,
              silverTickets,
              eventVenue
            } = item;
            return (
              <Link href={`/eventdetails/${eventId}`} key={i}>
                <EventCard
                  eventDate={eventDate}
                  eventId={eventId}
                  owner={owner}
                  eventName={eventName}
                  numSilverTickets={numSilverTickets}
                  numVipTickets={numVipTickets}
                  silverTicketPrice={silverTicketPrice}
                  vipTicketPrice={vipTicketPrice}
                  vipTickets={vipTickets}
                  silverTickets={silverTickets}
                  sellingDuration={sellingDuration}
                  eventVenue={eventVenue}
                />
              </Link>
            );
          })
        ) : (
          <p className='font-bold text-center pt-5 text-white'>
            You do not have any yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyEvents;