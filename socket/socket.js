const { Admin, Gallon } = require("../model/index");

module.exports = (socketIo) => {
  return socketIo.on("connection", (socket) => {
    console.log(`socket client: ${socket.id} user just connected`);
    var roomID;
    // join room
    socket.on("room", (room) => {
      if (room) {
        roomID = room;
        console.log(`joining room: ${room}`);
        socket.join(room);
      } else {
        console.log("room invalid");
      }
    });
    // if model changes call socket.emit;
    Gallon.watch({ admin: roomID }).on("change", (data) => {
      socket.to(roomID).emit("/api/gallons", roomID);
    });

    // disconnect
    socket.on("disconnected", () => {
      console.log("A user disconnected");
    });
  });
};
