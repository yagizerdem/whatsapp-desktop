import { Fragment, useEffect, useState } from "react";
import styles from "./styles/App.module.css";
import { socket } from "./socket";
import axios from "axios";

function App() {
  useEffect(() => {
    socket.connect();
  }, []);
  return (
    <Fragment>
      <div className={styles.left}>afaf</div>
      <div className={styles.right}></div>
    </Fragment>
  );
}
export async function loader() {
  // get user
  var result = await axios.get("http://localhost:8000/user/getcurrentuser", {
    withCredentials: true,
  });
  if (!result?.data?.ok) return null;
  const userid = result?.data?.data?._id;

  return null;
}

export default App;
