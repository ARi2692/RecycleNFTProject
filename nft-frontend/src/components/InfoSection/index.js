import React from 'react'
// import { INFO_ITEMS } from '../Data/infoItems'
// import InfoItem from './InfoItem'
import './infoSection.css'

const InfoSection = () => {
  return (
    <div className='info-section'>
      <div className='is-heading absolute-center'>
        <span className='header-gradient'>
          Create and sell your NFTs
        </span>
      </div>
      {/* <div className='is-items-container'>
        {INFO_ITEMS.map(_infoItem => {
          return <InfoItem item={_infoItem} />
        })}
      </div> */}
    </div>
  )
}

export default InfoSection
