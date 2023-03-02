import React from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import './header.css'

const Header = () => {
  return (
    <>
    <div className='header space-between'>
      <span className='header-gradient'>NFT Cave</span>
      <span className='connect-wallet'>
        <ConnectButton />
      </span>
    </div>
    </>
  )
}

export default Header
