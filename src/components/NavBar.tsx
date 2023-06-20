'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdClose, MdOutlineLogout } from 'react-icons/md';
import { Web3Provider } from '@ethersproject/providers';
import { setGlobalState, truncate } from 'store';

import WalletConnectProvider from '@walletconnect/web3-provider';
import Head from 'next/head';
import { useCallback, useEffect, useReducer } from 'react';
import WalletLink from 'walletlink';
import Web3Modal from 'web3modal';
import { ellipseAddress, getChainData } from '../lib/utilities';
import { ethers } from 'ethers';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad';

const providerOptions = {
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    },
    options: {
      appName: 'Coinbase', // Your app name
      networkUrl: `https://alfajores-forno.celo-testnet.org`,
      chainId: 44787,
    },
    package: WalletLink,
    connector: async (
      _: any,
      options: { appName: any; networkUrl: any; chainId: any }
    ) => {
      const { appName, networkUrl, chainId } = options;
      const walletLink = new WalletLink({
        appName,
      });
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
      await provider.enable();
      return provider;
    },
  },
};

let web3Modal: Web3Modal;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

type StateType = {
  provider?: any;
  web3Provider?: any;
  address?: string | null;
  chainId?: number | null;
};

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER';
      provider?: StateType['provider'];
      web3Provider?: StateType['web3Provider'];
      address?: StateType['address'];
      chainId?: StateType['chainId'];
    }
  | {
      type: 'SET_ADDRESS';
      address?: StateType['address'];
    }
  | {
      type: 'SET_CHAIN_ID';
      chainId?: StateType['chainId'];
    }
  | {
      type: 'RESET_WEB3_PROVIDER';
    };

export const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
};

export function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      };
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      };
    case 'RESET_WEB3_PROVIDER':
      return initialState;
    default:
      throw new Error();
  }
}

const NavBar = () => {
  const [opened, setOpened] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { provider, web3Provider, address, chainId } = state;

  const handleOpened = () => {
    setOpened(!opened);
  };
  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect();

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new Web3Provider(provider);

    const signer  = web3Provider.getSigner();
    const address = await signer.getAddress();
    setGlobalState('connectedAccount', address)
    //@ts-ignore
    setGlobalState('signer', signer)
    const network = await web3Provider.getNetwork();

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    });
  }, []);

  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect();
      }
      
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      });
      setGlobalState('connectedAccount', '')
    },
    [provider]
  );

  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connect();
    }
  }, [connect]);

  // A `provider` should come with EIP-1193 events. We'll listen for those events
  // here so that when a user switches accounts or networks, we can update the
  // local React state with that new information.
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts);
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId: string) => {
        window.location.reload();
      };

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error);
        disconnect();
      };

      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
      provider.on('disconnect', handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
          provider.removeListener('disconnect', handleDisconnect);
        }
      };
    }
  }, [provider, disconnect]);

  return (
    <div className=' sm:px-8 bg-[#2db369] z-20 mx-auto w-full fixed shadow-sm text-gray-50'>
      <div className=' flex items-center justify-between py-4 sm:mx-0 mx-4 '>
        <Link href={'/'}>
          <h1 className='font-black text-4xl'>Yob</h1>
        </Link>
        {/* tablet laptop */}
        <div className=''>
          <ul className='sm:flex justify-center gap-4 lg:mx-gap-10 text-gray-50 hidden font-medium'>
            <Link href={'/'}>
              <li className='cursor-pointer'>Home</li>
            </Link>
            <Link href={'/about'}>
              <li className='cursor-pointer'>About</li>
            </Link>
            <Link href={'/myEvents'}>
              <li className='cursor-pointer'>My events</li>
            </Link>
            <Link href={'/myTickets'}>
              <li className='cursor-pointer'>My tickets</li>
            </Link>
          </ul>
        </div>
        {/* phone */}
        <div className={opened ? 'block' : 'hidden'}>
          <ul className='fixed top-0 left-0 bottom-0 gap-3 flex flex-col shadow-xl overflow-hidden  w-5/6 max-w-sm py-6 px-6 bg-[#000] overflow-y-auto'>
            <Link href={'/'}>
              <li
                className='cursor-pointer text-lg font-medium'
                onClick={() => handleOpened()}
              >
                Home
              </li>
            </Link>
            <Link href={'/about'}>
              <li
                className='cursor-pointer text-lg font-medium'
                onClick={() => handleOpened()}
              >
                About
              </li>
            </Link>
            <Link href={'/myEvents'}>
              <li
                className='cursor-pointer text-lg font-medium'
                onClick={() => handleOpened()}
              >
                My events
              </li>
            </Link>
            <Link href={'/myTickets'}>
              <li
                className='cursor-pointer text-lg font-medium'
                onClick={() => handleOpened()}
              >
                Mytickets
              </li>
            </Link>
          </ul>
        </div>

        <div className='flex gap-1.5 items-center'>
          {address && (
            <div className='flex items-center gap-3'>
              <button
                disabled
                type='button'
                className=' sm:block bg-white font-medium  px-2.5 sm:px-3 py-1.5 sm:py-2 rounded text-gray-900 my-1 cursor-none'
              >
                {truncate(address.toLocaleLowerCase(), 6, 6, 15)}
              </button>
            </div>
          )}
          {web3Provider ? (
            <button
              type='button'
              className='hidden sm:block bg-white font-medium  px-2.5 sm:px-3 py-1.5 sm:py-2 rounded text-gray-900 my-1 cursor-pointer'
              onClick={disconnect}
            >
              Disconnect
            </button>
          ) : (
            <button
              type='button'
              className=' sm:block bg-white font-medium  px-2.5 sm:px-3 py-1.5 sm:py-2 rounded text-gray-900 my-1 cursor-pointer'
              onClick={() => connect()}
            >
              Connect Wallet
            </button>
          )}

          {opened ? (
            <div className='sm:hidden block'>
              <MdClose className='text-3xl' onClick={() => handleOpened()} />
            </div>
          ) : (
            <div className='sm:hidden block'>
              <HiMenuAlt3 className='text-3xl' onClick={() => handleOpened()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
