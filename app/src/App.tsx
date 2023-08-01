import React, { useEffect } from 'react'
import './App.css';
import { follow } from './SocialConnections/client'


function App() {
  useEffect(()=>{
    console.log('init')
  },[])
  return (
    <div className="App">
      <button onClick={async ()=>{
        await follow(["0xEd9A63754fd3204dca8f9088A768e2d61e232752", "0x4aBb740b74421C2F38A2E1296E487C65178Bc820", "0x47438a5Fd99AE22e2e34573627463056a643397C"])
      }}>CLICK</button>
    </div>
  );
}

export default App;
