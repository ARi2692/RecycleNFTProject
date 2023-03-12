import "./App.css";

import { Routes, Route } from "react-router-dom";
import React,  { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import './App.css'
import Header from "./components/Header";
import Footer from "./components/Footer";

import Explore from "./pages/Explore";
import Create from "./pages/Create";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  darkTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonMumbai,
} from "wagmi/chains";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { ethers } from "ethers";
import { getConfigByChain } from "./config";
import NFTMarketPlace from './artifacts/NFTMarketplace.json'
import NFT from './artifacts/NFT.json'

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [nft, setNFT] = useState({})
  const [marketplace, setMarketplace] = useState({})
  const [owner, setOwner] = useState(false)

  useEffect(() => {
    web3Handler();
  }, [chain, address]);

  // Login/Connect
  const web3Handler = async () => {
    
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // opens up metamask extension and connects Web2 to Web3
    const provider = new ethers.providers.Web3Provider(window.ethereum); //create provider
    const signer = provider.getSigner();
    const nft = new ethers.Contract(
      getConfigByChain(chain?.id)[0].nftAddress,
      NFT.abi,
      signer
    )
    const marketplace = new ethers.Contract(
      getConfigByChain(chain?.id)[0].nftMarketplaceAddress,
      NFTMarketPlace.abi,
      signer
    )

    console.log(nft)
    setNFT(nft)
    console.log(marketplace)
    setMarketplace(marketplace)
    const marketplaceOwner = await marketplace.feeAccount()
    if (marketplaceOwner===address) {
      setOwner(true)
    }
  }

  return (
    <div className='max-width'>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          coolMode
          chains={chains}
          theme={darkTheme({
            accentColor: "#b2b444",
            accentColorForeground: "white",
            borderRadius: "large",
            fontSize: 'large',
          })}
        >
          <Header />
          <Routes>
          {owner && 
          <>
            <Route exact path="/" element={<Create marketplace={marketplace} nft={nft} />} />
            <Route exact path="/explore" element={<Explore marketplace={marketplace} nft={nft} />} />
            </>
          }
          {!owner && 
            <Route exact path="/" element={<Explore marketplace={marketplace} nft={nft} />} />
          }
          </Routes>
          <Footer />
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;

