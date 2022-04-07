const app = require("express")();
require("dotenv").config();

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("newuser", (name) => {
    users[socket.id] = name;
    const joinmsg = name + " joined the chat";
    //console.log(payload)
    socket.broadcast.emit("userconnected", joinmsg);
    // socket.emit("joinedgroup", name)
  });

  socket.on("sendmember", (member) => {
    io.emit("member", users);
  });
  socket.on("sendchat", (payload) => {
    //console.log(payload)
    const fullmsg = users[socket.id] + " " + payload;
    socket.broadcast.emit("chat", fullmsg);
  });

  socket.on("disconnect", () => {
    const dismsg = users[socket.id] + " " + "Disconnected";
    socket.broadcast.emit("userdisconnected", dismsg);
    delete users[socket.id];
  });
});

server.listen( process.env.PORT || 8000, () => {
  console.log("server is runnnig");
});
