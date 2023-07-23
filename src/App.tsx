import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';
// @ts-ignore
import { RESTDataSource } from '@apollo/datasource-rest';
import axios from 'axios';
import { CosmWasmClient } from 'cosmwasm';
import abi from './abi.js';
const { ethers } = require('ethers');
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI('33b102361a2c443d8a29104d145cdefa');

const networkUrl = 'https://gnosis.api.onfinality.io/public';



// Create a provider connected to the Ethereum network
const provider = new ethers.providers.JsonRpcProvider(networkUrl);

const tokenAddress = '0x47ed03a82164270a5ecffc5afcaaecf576f2a8b8';

// Function to send a transaction using the hardcoded private key
async function sendTransaction(image: string) {
  try {
    // Create a wallet using the private key
    const wallet = new ethers.Wallet(process.env.PRIV, provider);

    // Get the sender's address from the wallet
    const senderAddress = await wallet.getAddress();

    const contract = new ethers.Contract(tokenAddress, abi, wallet);

    // Replace 'yourFunctionName' with the name of the function you want to call
    const functionName = 'mint';

    // Replace [param1Value, param2Value] with the actual values of the function's parameters
    const functionParams = [image];

    // Call the contract function
    const tx = await contract[functionName](...functionParams);

    // Prepare the transaction data
    // const txData = {
    //   to: '0x2D5f0067ac00A29Ba8a01d1989D9C0ca02440471',
    //   value: ethers.utils.parseUnits('10', 'gwei'), // Amount to send (in ether)
    //   gasPrice: ethers.utils.parseUnits('10', 'gwei'), // Gas price (in gwei, adjust as needed)
    //   gasLimit: 21000, // Gas limit (adjust as needed)
    //   nonce: await wallet.getTransactionCount(), // Get the sender's transaction count
    // };

    // // Sign the transaction
    // const signedTx = await wallet.signTransaction(txData);

    // // Send the transaction
    // const txResponse = await provider.sendTransaction(signedTx);

    // console.log('Transaction hash:', txResponse.hash);
    console.log('Transaction sent!');
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

const CATEGORY = {
  Busines: 'Business',
  Entertainment: 'Entertainment',
  General: 'General',
  Health: 'Health',
  Science: 'Science',
  Sports: 'Sports',
  Technology: 'Technology'
}

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

function DisplayLocations() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.locations.map(({ id, name, description, photo }:{id:any, name:any, description:any, photo:any}) => (
    <div key={id}>
      <h3>{name}</h3>
      <img width="400" height="250" alt="location-reference" src={`${photo}`} />
      <br />
      <b>About this location:</b>
      <p>{description}</p>
      <br />
    </div>
  ));
}

function App() {
  const baseURI = 'http://127.0.0.1:7860/';
  const [press, setPress] = useState(false);
  const [resp, setResp] = useState('loading...');

  const [news, setNews] = useState('');
  const [categories, setCategories] = useState([]);

  // get headline
  const url = 'https://coral-app-i986y.ondigitalocean.app/ask'
  // const data = {'new_prompt': todays_new}
  // const headers = {'Content-Type': 'application/json'}
  const [selected, setSelected] = useState(CATEGORY.Busines);



  useEffect(()=>{
    let getCategories = async () => {
      const client = await CosmWasmClient.connect("https://rpc.uni.junonetwork.io:443");
      // DAO: https://testnet.daodao.zone/dao/juno12atj46ek892d9nzz90pz555454ae5pmvl0mvxmhaae5vc4a5t32sxj4vsf/proposals
      let catsRes = await client.queryContractSmart("juno12atj46ek892d9nzz90pz555454ae5pmvl0mvxmhaae5vc4a5t32sxj4vsf", {"get_item": {"key": "categories"}});
      let cats = catsRes.item.split(',')
      console.log(cats)
      setCategories(cats)
    }
    getCategories()
   
        // Make a request for a user with a given ID
        axios.post('https://shark-app-ebe6n.ondigitalocean.app/news', {'category':selected.toLocaleLowerCase()})
        .then(function (response:any) {
          // handle success
          console.log('success with headlines!')
          console.log(response);
          setResp(response.data.answer)
        })
        .catch(function (error:any) {
          // handle error:any
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
    
      
  },[resp, selected])

  const [prompt, setPrompt] = useState('');

  useEffect(()=>{
    console.log('fires')
  },[])

  // get prompt
  useEffect(()=> {
    if (resp != 'loading...') {
      axios.post('https://shark-app-ebe6n.ondigitalocean.app/ask',
      {'new_prompt':resp},
      // {'Content-Type': 'application/json'}
      )
      .then(function (response:any) {
        console.log('success with prompt');
        console.log(response);
        setPrompt(response.data.answer);
      })
      .catch(function (error:any) {
        // handle error:any
        console.log('prompt error')
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    }
  },[resp]) 

const [image, setImage] = useState('');
const [images, setImages] = useState<string[]>([]);

  const api_key = '8laQcdKfZ8NURLkgkCcsTiDrEThXENe6nrf8pAiI8x8Fl6XEPmAOjlD9ufeY';
  useEffect(()=> {
    if (prompt != '') {
      console.log('img fires');
      axios.post('https://stablediffusionapi.com/api/v3/text2img',
      {
        'new_prompt':resp,
        "key": api_key,
        "prompt": prompt,
        "width": "512",
        "height": "512",
        "samples": "1",
        "num_inference_steps": "20",
        "guidance_scale": 7.5,
        "safety_checker": "yes",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "upscale": "no",
      }

      // {'Content-Type': 'application/json'}
      )
      .then(function (response:any) {
        console.log('success with img');
        console.log(response);
        setImage(response.data.output[0]);
        setImages([...images, image])
        sendTransaction(image);
      })
      .catch(function (error:any) {
        // handle error:any
        console.log('img error',error)
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
    }
  },[prompt])

  return (
    <div className='main'>
      <div className='title'>L'Artiste Autonome</div>
      <div className='contain'>
        <div  className='buttons'>
          {categories.map((value, key) => {
            return <div onClick={()=>setSelected(value)} className={selected == value ? 'selected' : ''} style={{margin: '3px'}}>{value}</div>
          })}
        </div>
        <br/>
        {/* <div className='textheader one'>Les Nouvelles</div> */}
        <div className='one'>{resp}</div>
        <br/>
        <div className='imgc'>
          <div className='inner1'>
            <div className='textheader two'>Le Prompt</div>
            <div>{prompt}</div>
          </div>
          <img className='img1' src={image}></img>
        </div>
        <div>
          {images.length > 0 ?
            images.map(img => {
              return(
                <img style={{maxHeight: '210px'}} src={img}></img>
              )
            }) : null}
        </div>
        </div>  

        </div>
  );
}

export default App;
