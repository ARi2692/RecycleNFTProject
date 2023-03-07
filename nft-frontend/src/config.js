export const networkConfig = {

    "137": [
        {
            nftAddress: "", //proxy deployment
            nftMarketplaceAddress: "",//proxy
            networkName: "Polygon mainnet"
        },
    ],
    "80001": [
        {
            nftAddress: "0x43C3c10dfB59DD201c554E00Dc5BFF825Bcc13c7", //proxy deployment
            nftMarketplaceAddress: "0x0345e50660C10AECd2884056fEAd4d5Aea8F95dE",//proxy 0xb68141B4271c9275f6eC0275eD857Ba960B888C1 
            networkName: "Mumbai Testnet"
        },
    ],
}


export const getConfigByChain = (chain) => networkConfig[chain]