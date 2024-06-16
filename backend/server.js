require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTIONSTRING);
const passport = require("passport");
const { app } = require("./app");

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const sessionMiddleware = require("./sessionmiddleware");
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
  const session = socket.request.user;
  console.log(session);
  console.log("girdi");
});

httpServer.listen(PORT, () => {
  console.log(`application is running at: http://localhost:${PORT}`);
});
