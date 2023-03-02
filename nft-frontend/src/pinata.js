import axios from 'axios'
// require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

// const axios = require('axios');
// const FormData = require('form-data');


export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};


// export const uploadFileToIPFS = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
  
//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'pinata_api_key': key,
//         'pinata_secret_api_key': secret,
//       }
//     };
  
//     try {
//       // First, upload the file to IPFS
//       const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, config);
      
//       // Then, pin the file to Pinata's servers
//       const pinataConfig = {
//         headers: {
//           'pinata_api_key': key,
//           'pinata_secret_api_key': secret,
//         },
//         data: {
//           ipfs_pin_hash: response.data.IpfsHash,
//         },
//       };
//       const pinResponse = await axios.post('https://api.pinata.cloud/pinning/pinByHash', null, pinataConfig);
  
//       console.log(pinResponse.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    try {
        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': key,
                'pinata_secret_api_key': secret,
            }
        })
        console.log("image uploaded", response.data.IpfsHash)
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    }
    
    //     .then(function (response) {
    //         console.log("image uploaded", response.data.IpfsHash)
    //         return {
    //            success: true,
    //            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
    //        };
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //         return {
    //             success: false,
    //             message: error.message,
    //         }

    // });
};