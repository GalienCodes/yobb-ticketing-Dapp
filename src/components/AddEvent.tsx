'use client';
import React, { useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { writeEvent } from '@/Blockchain';
import { setGlobalState, useGlobalState } from 'store';

const AddEvent = () => {
  const [modal] = useGlobalState('modal');
  const [title, setTitle] = useState('');
  const [numVipTickets, setNumVipTickets] = useState('');
  const [numSilverTickets, setNumSilverTickets] = useState('');
  const [silverTicketPrice, setSilverTicketPrice] = useState('');
  const [vipTicketPrice, setVipTicketPrice] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');

  const toTimestamp = (dateStr: string) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (
      !silverTicketPrice ||
      !vipTicketPrice ||
      !numSilverTickets ||
      !numVipTickets ||
      !title ||
      !eventDate ||
      !eventVenue
    )
      return;
    // eventDate

    try {
      const EventDay = toTimestamp(eventDate);
      await writeEvent(
        numVipTickets,
        numSilverTickets,
        vipTicketPrice,
        silverTicketPrice,
        title,
        EventDay,
        eventVenue
      );
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const closeModal = () => {
    setGlobalState('modal', 'scale-0');
  };

  const onClose = () => {
    setGlobalState('modal', 'scale-0');
    reset();
  };

  const reset = () => {
    setTitle('');
    setNumVipTickets('');
    setNumSilverTickets('');
    setSilverTicketPrice('');
    setVipTicketPrice('');
    setEventDate('');
    setEventVenue('');
  };

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-30
      flex items-center justify-center bg-black bg-opacity-20 
      transform duration-300 font-globalFont ${modal}`}
    >
      <div className='w-11/12 md:w-4/12 h-6/12 p-4 bg-[#279b5b] shadow-sm rounded py-4 px-3 text-white '>
        <div className='flex items-center justify-between'>
          <h2 className=' font-semibold text-lg'>Add Event</h2>
          <button type='button' onClick={closeModal}>
            <AiOutlineCloseCircle className='font-bold text-2xl ' />
          </button>
        </div>
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div className='flex flex-row justify-between items-centerborder rounded mt-2'>
            <input
              className='block w-full rounded placeholder:text-white
                  text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                  focus:outline-none focus:ring-0'
              type='text'
              name='title'
              placeholder='Title'
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className='flex flex-row justify-between items-centerborder rounded mt-2 gap-2'>
            <input
              className='block w-full rounded placeholder:text-white
                    text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                    focus:outline-none focus:ring-0'
              type='number'
              min={1}
              name='numSilverTickets'
              placeholder='No of Siver tickets'
              required
              onChange={(e) => setNumSilverTickets(e.target.value)}
              value={numSilverTickets}
            />
            <input
              className='block w-full rounded placeholder:text-white
                    text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                    focus:outline-none focus:ring-0'
              type='number'
              min={1}
              name='vipTicketCount'
              placeholder='No of VIP tickets'
              required
              onChange={(e) => setNumVipTickets(e.target.value)}
              value={numVipTickets}
            />
          </div>

          <div className='flex flex-row justify-between items-centerborder rounded mt-2 gap-2'>
            <input
              className='block w-full rounded placeholder:text-white                       text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                      focus:outline-none focus:ring-0  '
              type='number'
              min={0.01}
              name='silverTicketPrice'
              placeholder='Eg. 2 CELO/Ticket'
              required
              onChange={(e) => setSilverTicketPrice(e.target.value)}
              value={silverTicketPrice}
            />
            <input
              className='block w-full rounded placeholder:text-white
                    text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                    focus:outline-none focus:ring-0'
              type='number'
              min={0.2}
              name='vipTicketPrice'
              placeholder='Eg. 2 CELO/Ticket'
              required
              onChange={(e) => setVipTicketPrice(e.target.value)}
              value={vipTicketPrice}
            />
          </div>

          <div className='flex flex-row justify-between items-centerborder rounded mt-2'>
            <input
              className='block w-full rounded placeholder:text-white
                  text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                  focus:outline-none focus:ring-0'
              type='text'
              name='eventVenue'
              placeholder='Event Venue '
              required
              onChange={(e) => setEventVenue(e.target.value)}
              value={eventVenue}
            />
          </div>

          <div className='flex flex-row justify-between items-centerborder rounded mt-2'>
            <input
              className='inputData block w-full rounded placeholder:text-white
                 text-white bg-transparent border py-1.5 px-2 text-lg placeholder:text-lg  placeholder:font-normal font-normal
                 focus:outline-none focus:ring-0'
              min={new Date().toISOString().split('T')[0]}
              type='date'
              name='eventVenue'
              required
              onChange={(e) => setEventDate(e.target.value)}
              value={eventDate}
            />
          </div>
          <div className=' rounded mt-2'>
            <button
              type='submit'
              className='text-center bg-white text-gray-800 py-1.5 px-2 w-full rounded text-lg font-medium'
            >
              Sumbit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;