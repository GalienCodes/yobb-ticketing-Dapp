'use client';
import { getAllEvents, singleEvent } from '@/Blockchain';
import Ticket from '@/components/cards/Ticket';
import TicketCard from '@/components/cards/TicketCard';
import { log } from 'console';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { minutesRemaining, useGlobalState } from 'store';

const Eventdetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [sinleEvent] = useGlobalState('sinleEvent')
  const eventDetails = sinleEvent
  
  const [active, setActive] = useState(false);
//@ts-ignore
  const avialableSilverTickets = eventDetails?.silverTickets;
  //@ts-ignore
  const avialableVipTickets = eventDetails?.vipTickets;

  const numAvSilverTickets = avialableSilverTickets?.filter(
    (item: { isSold: boolean }) => item?.isSold == false
  );
  const numSoldSilverTickets = avialableSilverTickets?.filter(
    (item: { isSold: boolean }) => item?.isSold == true
  );

  const numAvVipTickets = avialableVipTickets?.filter(
    (item: { isSold: boolean }) => item?.isSold == false
  );
  const numSoldVipTickets = avialableVipTickets?.filter(
    (item: { isSold: boolean }) => item?.isSold == true
  );
  const oneHour = new Date(
    new Date().setMinutes(
      //@ts-ignore
      new Date().getMinutes() - -minutesRemaining(Number(eventDetails?.sellingDuration)).minutes
    )
  );

  useEffect(()=>{
    const loadData = async()=>{
      await getAllEvents();  
      await singleEvent(id)
  }
    loadData()
  },[id])

  return (
    <div className='py-24 sm:py-28 max-w-4xl mx-auto text-white'>
      <div className='mx-4'>
        <div className=' flex flex-col justify-center'>
          <div className='flex justify-between'>
            <h2 className=' font-semibold text-xl text-center'>
              {/* @ts-ignore */}
              {eventDetails?.eventName}
            </h2>
            <Countdown
              date={oneHour}
              renderer={({ minutes, seconds, completed }) => {
                if (completed) {
                  setActive(true);
                }
                return (
                  <h2 className=' font-semibold text-lg text-center'>
                    Event status:{' '}
                    <span className='p-1 rounded-2xl border font-medium'>
                      {completed ? 'Expired' : 'Active'}
                    </span>
                  </h2>
                );
              }}
            />
          </div>
          <div className='flex flex-col sm:flex-row gap-2 sm-gap-4 '>
            <div className='w-full sm:w-3/6'>
              <div className='flex justify-between'>
                <h2 className=' font-semibold text-lg py-2'>Silver Tickets</h2>
              </div>
              <div className='flex justify-between gap-2 text-center bg-white text-gray-800 py-1.5 px-2 w-full rounded text-lg font-medium mb-3 capitalize'>
                <p>available {numAvSilverTickets?.length}</p>
                <p>Sold: {numSoldSilverTickets?.length}</p>
              </div>
              <div>
                <div className='grid grid-cols-1 gap-2'>
                  {avialableSilverTickets?.length > 0
                    ? avialableSilverTickets?.map(
                        (
                          item: {
                            category: string;
                            eventDate?: number | undefined;
                            eventTitle: string;
                            isSold: boolean;
                            ticketId: number;
                            ticketPrice: string;
                            eventVenue: string;
                            eventId: number;
                          },
                          i: number
                        ) => {
                          const {
                            category,
                            eventDate,
                            eventTitle,
                            isSold,
                            ticketId,
                            ticketPrice,
                            eventId,
                          } = item;
                          return (
                            <Ticket
                              category={category}
                              eventDate={eventDate}
                              isSold={isSold}
                              //@ts-ignore
                              eventVenue={
                                //@ts-ignore
                                eventDetails && eventDetails?.eventVenue
                              }
                              eventId={eventId}
                              eventTitle={eventTitle}
                              ticketId={ticketId}
                              ticketPrice={ticketPrice}
                              completed={active}
                              //@ts-ignore
                              eventOwner={eventDetails.eventOwner}
                              key={i + 1}
                            />
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            </div>
            <div className='w-full sm:w-3/6'>
              <div className='flex justify-between'>
                <h2 className=' font-semibold text-lg py-2'>VIP Tickets</h2>
              </div>
              <div className='flex justify-between gap-2 text-center bg-white text-gray-800 py-1.5 px-2 w-full rounded text-lg font-medium mb-3 capitalize'>
                <p>available {numAvVipTickets?.length}</p>
                <p>Sold: {numSoldVipTickets?.length}</p>
              </div>
              <div>
                <div className='grid grid-cols-1 gap-2'>
                  {avialableVipTickets?.length > 0
                    ? avialableVipTickets?.map(
                        (
                          item: {
                            category: string;
                            eventDate?: number | undefined;
                            eventTitle: string;
                            isSold: boolean;
                            ticketId: number;
                            ticketPrice: string;
                            eventVenue: string;
                            eventId: number;
                          },
                          i: number
                        ) => {
                          const {
                            category,
                            eventDate,
                            eventId,
                            eventTitle,
                            isSold,
                            ticketId,
                            ticketPrice,
                          } = item;
                          return (
                            <Ticket
                              category={category}
                              eventDate={eventDate}
                              isSold={isSold}
                              //@ts-ignore
                              eventVenue={
                                //@ts-ignore
                                eventDetails && eventDetails?.eventVenue
                              }
                              eventId={eventId}
                              eventTitle={eventTitle}
                              ticketId={ticketId}
                              ticketPrice={ticketPrice}
                              completed={active}
                              //@ts-ignore
                              eventOwner={eventDetails.eventOwner}
                              key={i + 1}
                            />
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventdetails;