import { ethers } from 'ethers';
import { fromWei, toWei } from 'web3-utils';
import QRCode from 'qrcode';
import axios from 'axios';
import {
  getGlobalState,
  setAlert,
  setGlobalState,
  setLoadingMsg,
  useGlobalState,
} from 'store';
import { ContractInterface } from 'ethers';
import { Signer } from 'ethers';
import TicketNFT from '../abis/tikect.json';
import Ticketing from '../abis/yobooking.json';
import { log } from 'console';
import { REACT_APP_PINATA_BEARER_KEY } from 'store/secrets';
import { createCanvas, loadImage } from 'canvas';
import FormData from 'form-data';
import toast from 'react-hot-toast';
import { use } from 'react';

export const TicketNFTAddress = '0x9a6e5daeAcfdf268dA02300D65849525DFf17cdA';
const TicketingAddress = '0xcd3CfC5EA72265149dBd22f180a0d76d551E1687';

const getEtheriumContract = async (
  contractAddress: string,
  abi: ethers.Interface | ethers.InterfaceAbi
) => {
  const connectedAccount = getGlobalState('connectedAccount');

  if (connectedAccount) {
    const signer = getGlobalState('signer');
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  } else {
    return getGlobalState('contract');
  }
};

const TicketNFTContract = async () => {
  const TicketNFTContract = await getEtheriumContract(
    TicketNFTAddress,
    TicketNFT.abi
  );
  return TicketNFTContract;
};

const TicketingContract = async () => {
  const yobContract = await getEtheriumContract(
    TicketingAddress,
    Ticketing.abi
  );
  //@ts-ignore
  setGlobalState('contract', yobContract);
  return yobContract;
};

export const writeEvent = async (
  numVipTickets: string | number,
  numSilverTickets: string | number,
  vipTicketPrice: string | import('bn.js'),
  silverTicketPrice: string | import('bn.js'),
  title: string,
  eventDate: number,
  eventVenue: string
) => {
  const connectedAccount = getGlobalState('connectedAccount');

  try {
    if (connectedAccount) {
      vipTicketPrice = toWei(vipTicketPrice.toString(), 'ether');
      silverTicketPrice = toWei(silverTicketPrice.toString(), 'ether');
      numVipTickets = Number(numVipTickets);
      numSilverTickets = Number(numSilverTickets);
      setLoadingMsg('Add event');
      const contract = await TicketingContract();
      const transaction = await contract?.addEvent(
        numVipTickets,
        numSilverTickets,
        vipTicketPrice,
        silverTicketPrice,
        title,
        eventDate,
        eventVenue,
        { from: connectedAccount }
      );
      if (transaction) {
        setAlert('Event Added successfully', 'white');
        window.location.reload();
      }
    }
  } catch (error) {
    setAlert('Proccess failed', 'red');
    console.log(error);
  }
};

// ==========================
export const buyTicket = async (
  eventId: number,
  category: string,
  ticketPrice: string | import('bn.js'),
  ticketId?: number | import('bn.js')
) => {
  ticketPrice = toWei(ticketPrice.toString(), 'ether');
  const yobookingContract = await TicketingContract();
  const connectedAccount = getGlobalState('connectedAccount');

  try {
    setLoadingMsg('Purchase ticket');
    const bought = await yobookingContract?.buyTicket(eventId, category, {
      from: connectedAccount,
      value: ticketPrice,
    });
    //@ts-ignore
    const image_hash = await uploadTicketImage(ticketId);
    const result = await uploadJson(ticketId, image_hash);
    if (bought && result) {
      setAlert('Ticket bought successfully', 'green');
      window.location.href = '/myTickets';
    }
  } catch (error) {
    setAlert('Purchase failed!', 'red');
    console.error('Purchase failed', { error });
  }
};

// ========================
export const structuredEvent = (events: any | undefined[]) => {
  return events
    ?.map(
      (item: {
        eventId?: number;
        eventName: any;
        owner: string;
        numVipTickets: any;
        numSilverTickets: any;
        silverTicketPrice: string | import('bn.js');
        vipTicketPrice: string | import('bn.js');
        eventDate: any;
        sellingDuration: any;
        eventVenue: any;
        silverTickets: {
          category: string;
          eventDate?: number | undefined;
          eventName: string;
          isSold: boolean;
          ticketId: number;
          price: string;
          eventVenue: string;
        }[];
        vipTickets: {
          category: string;
          eventDate?: number | undefined;
          eventName: string;
          isSold: boolean;
          ticketId: number;
          price: string;
          eventVenue: string;
        }[];
      }) => ({
        eventId: item.eventId,
        eventName: item.eventName,
        owner: item.owner.toLowerCase(),
        numVipTickets: item.numVipTickets,
        numSilverTickets: item.numSilverTickets,
        silverTicketPrice: fromWei(Number(item.silverTicketPrice), 'ether'),
        vipTicketPrice: fromWei(Number(item.vipTicketPrice), 'ether'),
        eventDate: item.eventDate,
        sellingDuration: item.sellingDuration,
        eventVenue: item.eventVenue,
        silverTickets: item.silverTickets?.map(
          (el: {
            category: string;
            eventDate?: number;
            eventName: string;
            isSold: boolean;
            ticketId: number;
            price: string;
            eventVenue: string;
          }) => ({
            category: el.category,
            eventId: item.eventId,
            eventDate: el.eventDate,
            eventName: el.eventName,
            isSold: el.isSold,
            ticketId: el.ticketId,
            ticketPrice: fromWei(el.price, 'ether'),
            eventVenue: el.eventVenue,
          })
        ),
        vipTickets: item.vipTickets?.map(
          (el: {
            category: string;
            eventDate?: number;
            eventName: string;
            isSold: boolean;
            ticketId: number;
            price: string;
            eventVenue: string;
          }) => ({
            category: el.category,
            eventId: item.eventId,
            eventDate: el.eventDate,
            eventName: el.eventName,
            isSold: el.isSold,
            ticketId: el.ticketId,
            ticketPrice: fromWei(el.price, 'ether'),
            eventVenue: el.eventVenue,
          })
        ),
      })
    )
    .reverse();
};

const getAllEvents = async () => {
  const yobookingContract = await TicketingContract();
  if (!yobookingContract) return;
  // fetch all events
  try {
    const allEvents = await yobookingContract?.getAllEvents();
    setGlobalState('allEvents', structuredEvent(allEvents));
  } catch (error) {
    console.log(error);
  }
};

// ========================
const singleEvent = async (id: any) => {
  const yobookingContract = await TicketingContract();
  const allEvents = getGlobalState('allEvents');

  if (!yobookingContract) return;
  // fetch all events
  //@ts-ignore
  const myEvent = allEvents.find((event) => event?.eventId === BigInt(id));
  //@ts-ignore
  setGlobalState('sinleEvent', myEvent);
};
// ===============================
export const getMyEvents = async () => {
  const yobookingContract = await TicketingContract();
  const address = getGlobalState('connectedAccount');

  if (address) {
    try {
      // create an empty array that will contain every event added
      const allMyEvents = [];
      // assign the myEventCount to the variable counter
      setGlobalState('loaddata', {
        show: true,
        msg: 'loading events',
        color: '',
      });
      const counter = await yobookingContract?.myEventCount(address);

      for (let i = 0; i < counter; i++) {
        const singleEvent = await yobookingContract?.myEvents(address, i + 1);
        allMyEvents.push(singleEvent);
      }
      setGlobalState('myEvents', structuredEvent(allMyEvents));
      setGlobalState('loaddata', { show: false, msg: '', color: '' });
    } catch (error) {
      console.log(error);
    }
  }
};
// =====================================

const structuredTicket = (tickets: any[]) => {
  return tickets
    .map(
      (item: {
        ticket: {
          category: any;
          eventDate: any;
          eventId: any;
          eventName: string | any;
          ticketId: any;
          isSold: boolean | any;
          eventVenue: any;
          price: any | import('bn.js');
        };
      }) => ({
        ticket: {
          category: item.ticket.category,
          eventDate: item.ticket.eventDate,
          eventId: item.ticket.eventId,
          eventTitle: item.ticket.eventName,
          ticketId: item.ticket.ticketId,
          sold: item.ticket.isSold,
          eventVenue: item.ticket.eventVenue,
          ticketPrice: fromWei(item.ticket.price, 'ether'),
        },
      })
    )
    .reverse();
};

export const getMyTickets = async () => {
  const yobookingContract = await TicketingContract();
  const address = getGlobalState('connectedAccount');

  if (address)
    try {
      // create an empty array that will contain every ticket purchased
      const allMyTickets = [];
      // assign the orderCount to the variable counter
      setGlobalState('loaddata', {
        show: true,
        msg: 'loading tickets',
        color: '',
      });
      const counter = await yobookingContract?.orderCount(address);

      for (let i = 0; i < counter; i++) {
        const ticket = await yobookingContract?.myOrders(address, i + 1);
        allMyTickets.push(ticket);
      }
      //@ts-ignore

      setGlobalState('myTickets', structuredTicket(allMyTickets));

      setGlobalState('loaddata', { show: false, msg: '', color: '' });

      return structuredTicket(allMyTickets);
    } catch (error) {
      console.log('error', error);
    }
};

// QRHelper
//@ts-ignore

export const renderQRcode = async (ticket_id, type = 'blob') => {
  const address = getGlobalState('connectedAccount');
  // qr code size
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  ctx.font = '20px Arial';

  // we set label and set it to the center
  const textString = 'Yob Ticket #' + ticket_id,
    textWidth = ctx.measureText(textString).width;

  ctx.fillText(textString, canvas.width / 2 - textWidth / 2, 180);

  const qrOption = {
    width: 180,
    padding: 0,
    margin: 0,
  };

  // qr code value
  const qrString =
    window.location.origin + '/ticket_info/' + address + '/ticket/' + ticket_id;
  const bufferImage = await QRCode.toDataURL(qrString, qrOption);

  return loadImage(bufferImage).then((image) => {
    ctx.drawImage(image, 22, 5, 155, 155);

    if (type === 'data') return canvas.toDataURL();

    return new Promise((resolve) => {
      //@ts-ignore 
      canvas.toBlob(resolve);
    });
  });
};

// upload image to pinata, result will be ipfs hash
//@ts-ignore
export const uploadTicketImage = async (ticket_id) => {
  const address = getGlobalState('connectedAccount');

  const buffer = await renderQRcode(address, ticket_id);

  try {
    const data = new FormData();
    //@ts-ignore
    data.append('file', buffer, {
      filepath: `ticket${ticket_id}.jpg`,
    });

    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      data,
      {
        //@ts-ignore
        maxBodyLength: 'Infinity',
        headers: {
          //@ts-ignore
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNDRmNjBiYS1kZjA4LTQ0ZWYtOTI1Zi1lODZlNmQwYzc5YzUiLCJlbWFpbCI6ImdhbGllbmNvZGVzMTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjkzNmJlOTcxMDcwYzExZDFlMTdiIiwic2NvcGVkS2V5U2VjcmV0IjoiNDUxNDNkM2Q5OWQ3NWI5YzVmYmQ4NzY0MDgzNDE3YTcwMDgyNmRjNjIwNmQ2MGM2OGVhMWI4ZTYyOWYwYzc0YiIsImlhdCI6MTY4MzczOTkwOH0.9zprp48nJb9YH9Fq_ExRr1VC3y0heRp5EIAiGHWBzRs'}`,
        },
      }
    );

    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};

// upload json to pinata, result will be ipfs hash
//@ts-ignore
export const uploadJson = async (ticket_id, hash) => {
  var data = JSON.stringify({
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: `ticket${ticket_id}_metadata`,
    },
    pinataContent: {
      image: `https://gateway.pinata.cloud/ipfs/${hash}`,
    },
  });

  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNDRmNjBiYS1kZjA4LTQ0ZWYtOTI1Zi1lODZlNmQwYzc5YzUiLCJlbWFpbCI6ImdhbGllbmNvZGVzMTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjkzNmJlOTcxMDcwYzExZDFlMTdiIiwic2NvcGVkS2V5U2VjcmV0IjoiNDUxNDNkM2Q5OWQ3NWI5YzVmYmQ4NzY0MDgzNDE3YTcwMDgyNmRjNjIwNmQ2MGM2OGVhMWI4ZTYyOWYwYzc0YiIsImlhdCI6MTY4MzczOTkwOH0.9zprp48nJb9YH9Fq_ExRr1VC3y0heRp5EIAiGHWBzRs'}`,
    },
    data: data,
  };

  const res = await axios(config);

  return res.data.IpfsHash;
};

// QRHelper----end--------------------------

// ticketnft

export const mintsByUser = async () => {
  const address = getGlobalState('connectedAccount');
  const ticketNFTContract = await TicketNFTContract();

  var mints = [];
  if (address) {
    try {
      mints = await ticketNFTContract?.mintsByUser(address);
      return mints;
    } catch (error) {
      console.log(error);
    }
  }

  return mints;
};

export const safeMint = async (ticket_id: number, uri: string) => {
  const ticketNFTContract = await TicketNFTContract();
  const address = getGlobalState('connectedAccount');
  if (address) {
    try {
      setLoadingMsg('Mint Ticket');
      const result = await ticketNFTContract?.safeMint(
        address,
        ticket_id,
        uri,
        { from: address }
      );
      if (result) {
        setAlert('Ticket minted successfully');
        window.location.reload();
      }
      return true;
    } catch (e) {
      console.log({ e });
      setAlert('Proccess failed', 'red');
    }
  }
};
// ====Ticket Nft Done===========

// =================================================
// fetch information about a ticket
//@ts-ignore
export const fetchInfo = async (ticket_id) => {
  let ticket;
  const temp = await getMyTickets();

  try {
    ticket = temp?.find(
      (target) => target.ticket?.ticketId === BigInt(ticket_id)
    )?.ticket;
    setGlobalState('ticket_index', ticket_id);
  } catch (e) {
    console.log({ e });
  }

  if (ticket) {
    setGlobalState('loadingTicketInfo', true);

    // fetch qr code of a ticket
    //@ts-ignore
    setGlobalState('qr_code', await renderQRcode(ticket_id, 'data'));
    //@ts-ignore
    setGlobalState('singleTicket', ticket);
    //@ts-ignore
    setGlobalState('ticket_info', ticket);

    setGlobalState('loadingTicketInfo', false);
  } else {
    setGlobalState('loadingTicketInfo', false);
    toast.error('Ticket not found');
  }
};
// fetch minted nfts by user
export const fetchMinted = async () => {
  try {
    const mints = await mintsByUser();
    setGlobalState('minted', mints);
  } catch (error) {
    console.log(error);
  }
};

export { TicketNFTContract, TicketingContract, getAllEvents, singleEvent };
