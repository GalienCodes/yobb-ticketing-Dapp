
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { createGlobalState } from "react-hooks-global-state";

const {setGlobalState, useGlobalState, getGlobalState }=createGlobalState({
  ticket_id: null,
  qr_code:'',
  connectedAccount: '',
  modal: 'scale-0',
  modalQr: 'scale-0',
  started:false,
  signer:null,
  alert: { show: false, msg: '', color: '' },
  loaddata: { show: false, msg: '', color: '' },
  loading: { show: false, msg: '' },
  myEvents:[],
  myEvent:null,
  myTickets:[],
  allEvents: [],
  sinleEvent: null,
  contract: null,
  minted: [],
  loadingTicketInfo: false,
  //@ts-ignore 
  qr_code: '',
  ticket_index: null,
  ticket_info: null,
  singleTicket:null,
  });

  function minutesRemaining(timestamp: number) {
    var currentTime = Math.floor(Date.now() / 1000);
    var timeDifference = currentTime - (timestamp);
    
    var minutes = Math.floor(timeDifference / 60);
    var seconds = timeDifference % 60;
    return { minutes:-minutes,
      seconds:-seconds
    };
    
  } 
  
  const displayData = (eventDate: any )=>{
    const date = new Date(Number(eventDate) * 1000);
    const dateString =  date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
    return dateString;
  }
  const setAlert = (msg: any, color = 'green') => {
    setGlobalState('loading', {msg:"",show: false})
    setGlobalState('alert', { show: true, msg, color })
    setTimeout(() => {
      setGlobalState('alert', { show: false, msg: '', color })
    }, 3000)
  }
  
  const setLoadingMsg = (msg: any) => {
    const loading = getGlobalState('loading')
    setGlobalState('loading', {show: true, msg })
  }


const truncate = (text: string | any, startChars:number, endChars:number, maxLength:number) => {
  if (text?.length > maxLength) {
    var start = text.substring(0, startChars)
    var end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}
export {
  useGlobalState,
  setGlobalState,
  getGlobalState,
  setAlert,
  setLoadingMsg,
  minutesRemaining,
  displayData,
  truncate,
}