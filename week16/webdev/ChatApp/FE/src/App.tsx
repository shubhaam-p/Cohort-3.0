import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [msgs, setmsgs] = useState(['hello', 'hello6', 'hello54', 'hello5', 'hello4']);
  let wsRef = useRef('');
  const userMsg = useRef('');
  const grpCode = useRef('');
  useEffect(()=>{
    const wss = new WebSocket('ws://localhost:8080');
    wsRef.current = wss;
    wss.onopen=()=>{
      console.log("connected");
    }
    wss.onmessage=(msg)=>{
      setmsgs(m => [...m, msg.data])
    }

    return () => {
      wss.close()
    }
  },[]);

  function sendMsg(){
    console.log(userMsg.current.value);
    wsRef.current.send(JSON.stringify({
        "type": "chat",
        "payload": {
          "message":userMsg.current.value
        }
    })
  )};

  function joinGrp(){
    wsRef.current.send(JSON.stringify({
      "type": "join",
      "payload": {
        "roomId":grpCode.current.value
      }
  })
  );
  }

  return (
    <div className='grid gap-4'>
      <div className='bg-black  w-full h-64 mt-6 px-4'>
        { msgs.map(msg =><div className='text-white'>{msg}</div>) }
      </div>

      <div>
        <label htmlFor="roomId" className='block text-sm/6 font-medium text-gray-900'>Enter Room Id: </label>
        <input type="text" name="" id="roomId" ref={grpCode} className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6'/>
        <button className='px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-md shadow-sm opacity-100' onClick={joinGrp}>Join</button>
      </div>
      <div>
        <input type="text" name="" id="" ref={userMsg} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"/>
      </div>
      <div>
        <button  className='px-4 py-2 font-semibold text-sm bg-sky-500 text-white rounded-md shadow-sm opacity-100' onClick={sendMsg}>Send</button>
      </div>
    </div>
  )
}

export default App