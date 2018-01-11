
// var store = {};

// io.on('connection', function (socket) {
//   socket.on('join', function(msg) {
//     usrobj = {
//       'room': msg.roomid,
//       'name': msg.name
//     };
//     store[msg.id] = usrobj;
//     socket.join(msg.roomid);
//   });

//   socket.on('chat message', function(msg) {
//     io.to(store[msg.id].room).emit('chat message', msg);
//   });
//   socket.on('map message', function(msg) {
//     io.to(store[msg.id].room).emit('map message', msg);
//   });
// });
// // io.on('connection', (socket) => {
// //     socket.on('chat message', (msg) => {
// //       io.emit('chat message', msg);
// //     });
// //     socket.on('map message', (msg) => {
// //       io.emit('map message', msg);
// //     });
// // });
// // io.on('connection', (socket) => {
// //   console.log('a user connected');
// //   socket.on('chat message', (msg) => {
// //     console.log('message: ' + msg);
// //     io.emit('chat message', msg);
// //   });
// // });