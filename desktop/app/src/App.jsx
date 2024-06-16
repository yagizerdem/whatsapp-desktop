import { Fragment, useEffect, useState } from "react";
import "./styles/App.css";
import { socket } from "../socket";

function App() {
  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <Fragment>
      <div>app</div>
    </Fragment>
  );
}

export default App;
