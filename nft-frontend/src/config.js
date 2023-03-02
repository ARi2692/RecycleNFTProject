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
            nftAddress: "0xe79e067aD15ea7E6F7Ff92a46f9e63dB54B6aE18", //proxy deployment
            nftMarketplaceAddress: "0xb68141B4271c9275f6eC0275eD857Ba960B888C1",//proxy
            networkName: "Mumbai Testnet"
        },
    ],
}


export const getConfigByChain = (chain) => networkConfig[chain]