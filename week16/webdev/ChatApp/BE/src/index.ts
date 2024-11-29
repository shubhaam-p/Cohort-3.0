import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
interface User{
  socket:WebSocket,
  roomId:String
}

const allSockets:User[] = [];

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    const parseData = JSON.parse(data.toString())
    // console.log(parseData);
    if(parseData.type=='join'){
      const roomId = parseData.payload.roomId;
      allSockets.push({
        socket:ws,
        roomId:roomId
      })
      console.log("join", parseData.payload.roomId, allSockets);
    }
    
    if(parseData.type=='chat'){
      let currentUserRoom = null;
      currentUserRoom = allSockets.find((x)=> x.socket==ws)?.roomId;
      console.log("room " , currentUserRoom);
      allSockets.forEach((x)=>{
        if(x.roomId == currentUserRoom){
          x.socket.send(parseData.payload.message);
        }
      })
    }
  });

});