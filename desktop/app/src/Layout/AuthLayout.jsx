import { Fragment, useRef, useState } from "react";
import styles from "../styles/Auth.module.css";
import axios from "axios";
import notify from "../util/notify";
import { useNavigate } from "react-router";
const modes = {
  login: 0,
  singup: 1,
};
const extraStyles = {
  show: { transform: "rotateY(0deg)" },
  hide: { transform: "rotateY(180deg)" },
};

export default function AuthLayout() {
  const [mode, setModes] = useState(modes.singup);
  const singUpFormRef = useRef();
  const logInFormRef = useRef();
  const navigate = useNavigate();

  async function signUp(e) {
    e.preventDefault();
    const userData = {};
    const formData = new FormData(singUpFormRef.current);
    for (const [key, value] of formData) {
      userData[key] = value;
    }
    try {
      console.log(userData);
      const { data } = await axios.post(
        "http://localhost:8000/auth/register",
        userData,
        {
          headers: {
            "Content-Type": "application/json", // Ensure the Content-Type is set to application/json
          },
          withCredentials: true,
        }
      );
      if (!data.ok) {
        throw new Error();
      }
      const msg = data?.message || "register successfull";
      notify(msg);
      setModes(modes.login);
    } catch (err) {
      console.log(err);
      const msg = err?.response?.data?.error || "error occurred";
      notify(msg);
    }
  }

  async function login(e) {
    e.preventDefault();
    const body = {};
    const formData = new FormData(logInFormRef.current);
    for (const [key, value] of formData) {
      body[key] = value;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8000/auth/login",
        body,
        {
          headers: {
            "Content-Type": "application/json", // Ensure the Content-Type is set to application/json
          },
          withCredentials: true,
        }
      );
      const msg = data?.message || "login successfull";
      notify(msg);
      return navigate("/");
    } catch (err) {
      console.log(err);
      const msg = err?.response?.data?.message || "error occurred";
      notify(msg);
    }
  }

  return (
    <Fragment>
      <div className={styles.center}>
        <div className={styles.card}>
          <div
            className={styles.front}
            style={mode == modes.singup ? extraStyles.show : extraStyles.hide}
          >
            <h2>Sign Up</h2>
            <hr />
            <form ref={singUpFormRef}>
              <input
                placeholder="enter your first name"
                name="firstName"
              ></input>
              <input placeholder="enter your last name" name="lastName"></input>
              <input placeholder="enter your email" name="email"></input>
              <input placeholder="enter your password" name="password"></input>
              <button type="submit" onClick={signUp}>
                register
              </button>
            </form>
          </div>
          <div
            className={styles.back}
            style={mode == modes.login ? extraStyles.show : extraStyles.hide}
          >
            <h2>Log In</h2>
            <hr />
            <form ref={logInFormRef}>
              <input placeholder="enter your email" name="email"></input>
              <input placeholder="enter your password" name="password"></input>
              <button type="submit" onClick={login}>
                log in
              </button>
            </form>
          </div>
        </div>
        <button onClick={() => setModes((prev) => (prev + 1) % 2)}>
          {mode == modes.singup ? "switch to log in" : "switch to sign up"}
        </button>
      </div>
    </Fragment>
  );
}
