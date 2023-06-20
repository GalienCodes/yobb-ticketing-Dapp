import { getAllEvents, getMyEvents, getMyTickets } from '@/Blockchain';
import AddEvent from '@/components/AddEvent';
import Alert from '@/components/Alert';
import ClientOnly from '@/components/ClientOnly';
import Footer from '@/components/Footer';
import LoadData from '@/components/LoadData';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useGlobalState } from 'store';

export default function App({ Component, pageProps }: AppProps) {
  const connectedAccount = useGlobalState ('connectedAccount')

  useEffect(() => {
    const loadData = async () => {
      await getAllEvents();  
      getMyEvents()
      await getMyTickets()
    }
    loadData();
  }, [connectedAccount]);
  return (
    <ClientOnly>
      <NavBar />
      <Component {...pageProps} />
      <AddEvent />
      <Loading />
      <Alert />
      <LoadData />
      <Footer />
    </ClientOnly>
  );
}
