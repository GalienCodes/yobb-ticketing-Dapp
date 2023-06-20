'use client';
import React from 'react';
import Link from 'next/link';
import { useGlobalState } from 'store';
import EventCard from './cards/EventCard';

export interface Ticket {
  category: string;
  eventDate?: number | undefined;
  eventTitle: string;
  sold: boolean;
  ticketId: number;
  ticketPrice: string;
  eventVenue: string;
  eventId: number;
}

const Events = () => {
  const [allEvents] = useGlobalState('allEvents'); 
  return (
    <>
      <div className='mx-4 sm:mx-0 grid grid-cols-1  gap-2 sm:grid-cols-2 sm:gap-4'>
        {allEvents?.map(
          (
            item: {
              eventId: number;
              eventDate?: number;
              owner?: string | undefined;
              eventName?: string;
              numSilverTickets?: number;
              numVipTickets?: number;
              sellingDuration?: string;
              silverTicketPrice?: string;
              vipTicketPrice?: string;
              vipTickets:Ticket[];
              silverTickets:Ticket[];
              eventVenue: string;
            },
            i: number
          ) => {
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
              <Link href={`/eventdetails/${item.eventId}`} key={i}>
                <EventCard
                  eventDate={eventDate}
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
                  eventId={0}                />
              </Link>
            );
          }
        )}
      </div>
    </>
  );
};

export default Events;
