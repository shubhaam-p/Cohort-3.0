"use strict";
// import { WebSocketServer, WebSocket } from 'ws';
Object.defineProperty(exports, "__esModule", { value: true });
// const wss = new WebSocketServer({ port: 8080 });
// interface User{
//   socket:WebSocket,
//   roomId:String
// }
// const allSockets:User[] = [];
// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);
//   ws.on('message', function message(data) {
//     const parseData = JSON.parse(data.toString())
//     // console.log(parseData);
//     if(parseData.type=='join'){
//       const roomId = parseData.payload.roomId;
//       allSockets.push({
//         socket:ws,
//         roomId:roomId
//       })
//       console.log("join", parseData.payload.roomId, allSockets);
//     }
//     if(parseData.type=='chat'){
//       let currentUserRoom = null;
//       currentUserRoom = allSockets.find((x)=> x.socket==ws)?.roomId;
//       console.log("room " , currentUserRoom);
//       allSockets.forEach((x)=>{
//         if(x.roomId == currentUserRoom){
//           x.socket.send(parseData.payload.message);
//         }
//       })
//     }
//   });
// });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log("user joined room " + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            console.log("user wants to chat");
            // const currentUserRoom = allSockets.find((x) => x.socket == socket).room
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
