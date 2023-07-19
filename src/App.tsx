import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql } from '@apollo/client';
import { RESTDataSource } from '@apollo/datasource-rest';
import axios from 'axios';
// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI('33b102361a2c443d8a29104d145cdefa');

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
  
  // get headline
  const url = 'https://coral-app-i986y.ondigitalocean.app/ask'
  // const data = {'new_prompt': todays_new}
  // const headers = {'Content-Type': 'application/json'}
  const [selected, setSelected] = useState(CATEGORY.Busines);

  useEffect(()=>{

   
        // Make a request for a user with a given ID
        axios.post('https://coral-app-i986y.ondigitalocean.app/news', {'category':selected.toLocaleLowerCase()})
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
      axios.post('https://coral-app-i986y.ondigitalocean.app/ask',
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
      <div className='title'>L'Artiste Autonomie</div>
      <div className='contain'>
      <div  className='buttons'>
          <div onClick={()=>setSelected(CATEGORY.Busines)} className={selected == CATEGORY.Busines ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Busines}</div>
          <div onClick={()=>setSelected(CATEGORY.Entertainment)} className={selected == CATEGORY.Entertainment ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Entertainment}</div>
          <div onClick={()=>setSelected(CATEGORY.General)} className={selected == CATEGORY.General ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.General}</div>
          <div onClick={()=>setSelected(CATEGORY.Health)} className={selected == CATEGORY.Health ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Health}</div>
          <div onClick={()=>setSelected(CATEGORY.Science)} className={selected == CATEGORY.Science ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Science}</div>
          <div onClick={()=>setSelected(CATEGORY.Sports)} className={selected == CATEGORY.Sports ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Sports}</div>
          <div onClick={()=>setSelected(CATEGORY.Technology)} className={selected == CATEGORY.Technology ? 'selected' : ''} style={{margin: '3px'}}>{CATEGORY.Technology}</div>
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
          <img src={image}></img>
        </div>
      </div>
      
    </div>
  );
}

export default App;
