import React,  { useState } from 'react'
import InfoSection from '../../components/InfoSection'
import './create.css'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";
import { useLocation } from "react-router";
import { Link } from 'react-router-dom';

const Create = ({ marketplace, nft }) => {

  const [formParams, updateFormParams] = useState({ name: '', description: '', price: '', toAddress: ''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            console.log("response coming", response);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
    }

    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const {name, description, price, toAddress} = formParams;
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !toAddress || !fileURL)
            return;

        const nftJSON = {
            name, description, price, toAddress, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();

            updateMessage("Please wait.. uploading (upto 5 mins)")

            // mint nft 
            await(await nft.mint(metadataURL)).wait()
            // get tokenId of new nft 
            const id = await nft.tokenCount()
            // approve marketplace to spend nft
            await(await nft.setApprovalForAll(marketplace.address, true)).wait()
            // add nft to marketplace
            const listingPrice = ethers.utils.parseEther(formParams.price.toString())
            await(await marketplace.makeItem(nft.address, id, listingPrice, formParams.toAddress.toString(), { value: listingPrice })).wait()
            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', price: '', toAddress: ''});
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

  return (
    <>
    <div>
      <InfoSection />
    </div>

    <div className="file-card">

    <div className="file-inputs">
        
        <input className='input-container' type="file" onChange={OnChangeFile} />
        <button className='button-sec'>
            <AiOutlinePlusCircle/>
            Upload
        </button> 
        
    </div>

    <p className="main">Supported files</p>
    <p className="info">PDF, JPG, PNG</p>
    {/* <p className="info"></p> */}

    </div>
    <div className='input-box'>
      <input  value={formParams.name} onChange={e => updateFormParams({...formParams, name: e.target.value})} size="lg" required type="text" placeholder="Name" />
      <input  value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})} size="lg" required type="textarea" placeholder="Description" />
      <input className='input-box-last' value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})} step="0.01" size="lg" required type="number" placeholder="Min 0.01 ETH" />
      <input className='input-box-last' value={formParams.toAddress} onChange={e => updateFormParams({...formParams, toAddress: e.target.value})} step="0.01" size="lg" required type="text" placeholder="Address of seller" />
    </div>

    <div className='cr-btns absolute-center' >
    <Link to="/explore" style={{textDecoration:'none'}} > 
    <button className="button-create">
      Explore
    </button>
    </Link>
    {/* <div className="text-green text-center">{message}</div> */}
    <button onClick={listNFT} className="button-create">
      Create & List NFT!
    </button>
    </div>
    </>
  )
}

export default Create
