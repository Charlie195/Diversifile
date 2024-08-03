'use client'; // Ensure this file is treated as a Client Component

// import { set } from "@auth0/nextjs-auth0/dist/session";
import { useUser } from '@auth0/nextjs-auth0/client';
import Navbar from "../../components/Navbar";
import { useState } from 'react';

const axios = require("axios");

const Page = () => {

  const [ticker, setTicker] = useState("") 

  const [imageUrl, setImageUrl] = useState(null);
  const [imageMessage, setImageMessage] = useState(null);
  const [latestOHLC, setLatestOHLC] = useState(null);

  const { user, error, isLoading } = useUser();

  const searchTicker = async () => {
    // Handle the search logic here (e.g., send ticker to an API)
    console.log('Searching for ticker:', ticker);
    const ticketVal = ticker;


    // Clear the input field
    setTicker('');

    console.log("before")
    const res = await axios.post(`http://localhost:5001/getTicker`, { ticker: ticketVal, username: user.name, email: user.email }, { responseType: 'blob' });

    if (res.status === 204) {
      console.log('No data available for the given date range.');
      setImageMessage(`No data available for "${ticketVal}"`);
      setImageUrl(null);
    } else {
      setImageUrl(URL.createObjectURL(res.data));
      setImageMessage(null);
    }

    const res2 = await axios.post(`http://localhost:5001/getLatestOHLC`, { username: user.name, email: user.email });
    setLatestOHLC(res2.data);
  };

  return (
    <div className="min-h-screen flex flex-col text-white">

      <Navbar />

      <div className="flex flex-1">
        <aside className="w-1/2 p-4">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          
          <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 rounded-l-md border border-gray-600 bg-gray-900 text-white focus:outline-none"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
            <button
              onClick={searchTicker}
              className="p-2 bg-blue-600 rounded-r-md border border-blue-700 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
        </aside>

        {/* Main content area */}
        <main className="w-1/2 p-4">
          <h1 className="text-2xl font-bold">Your Portfolio</h1>
          {/* Your main content goes here */}
        </main>
      </div>

      {imageUrl && <img src={imageUrl} alt="Test" />}
      {imageMessage && <div>{imageMessage}</div>}
      {latestOHLC && <div>Open: {latestOHLC.open}
                          Close: {latestOHLC.close}
                          High: {latestOHLC.high}
                          Low: {latestOHLC.low}</div>}
    </div>
  );
};

export default Page;
