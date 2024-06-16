require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTIONSTRING);
const passport = require("passport");
const { app } = require("./app");

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const sessionMiddleware = require("./sessionmiddleware");
const { UserData, userStore } = require("./DynamicUserStore");
// const sharedSession = require('express-socket.io-session'); // sync

const PORT = process.env.PORT || 8000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function onlyForHandshake(middleware) {
  return (req, res, next) => {
    const isHandshake = req._query.sid === undefined;
    if (isHandshake) {
      middleware(req, res, next);
    } else {
      next();
    }
  };
}

io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.writeHead(401);
      res.end();
    }
  })
);

io.on("connection", (socket) => {
  console.log("socket connected");
  const session = socket.request.user;
  const id = session._id;
  const userData = new UserData();
  userData.id = id;
  userData.socketid = socket.id;
  userStore[userData.id] = userData;
  // console.log(userStore);
  socket.on("disconnect", (reason) => {
    delete userStore[userData.id];
    console.log(`${socket.id} disconnected reason -> ${reason} `);
    // console.log(userStore);
  });
});

httpServer.listen(PORT, () => {
  console.log(`application is running at: http://localhost:${PORT}`);
});
