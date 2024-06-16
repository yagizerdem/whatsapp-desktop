import { Fragment, useRef, useState } from "react";
import axios from "axios";
import { useLoaderData, useNavigate, redirect } from "react-router";
import notify from "./util/notify";
import styles from "./styles/Profile.module.css";
import { socket } from "./socket";
function determineProfileImage(userData) {
  if (!userData.profileImage) return "./emptyprofile.jpg";
  return `http://localhost:8000/public/uploads/${userData.profileImage}`;
}

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData();
  const [profileImageSrc, setProfileImageSrc] = useState(() =>
    determineProfileImage(userData)
  );
  const inputFileRef = useRef();
  async function logout() {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      if (!data.ok) throw new Error();
      document.cookie =
        "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      notify(data.message);
      socket.disconnect();
      navigate("/Auth");
    } catch (err) {
      notify("error occured while log  out");
    }
  }
  async function setProfileImage(e) {
    const file = e.target.files[0]; // send blob to api
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { data } = await axios.post(
        "http://localhost:8000/user/uploadprofileimage",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the correct content type is set
          },
        }
      );
      const user = data?.data;
      if (user) setProfileImageSrc(determineProfileImage(user));
    } catch (err) {
      notify("error occured");
    }
  }

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <img
            src={profileImageSrc}
            className={styles.profile}
            onClick={() => inputFileRef.current.click()}
          ></img>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
          </svg>
        </div>

        <input
          disabled
          type="text"
          value={`first name : ${userData.firstName}`}
        ></input>
        <input
          disabled
          type="text"
          value={`last name : ${userData.lastName}`}
        ></input>
        <button onClick={logout}>log out</button>
      </div>
      <input
        type="file"
        hidden
        ref={inputFileRef}
        onChange={setProfileImage}
      ></input>
    </Fragment>
  );
}
export async function loader() {
  const { data } = await axios.get(
    "http://localhost:8000/user/getcurrentuser",
    {
      withCredentials: true,
    }
  );
  if (!data.ok) {
    notify("error occured in profile ... ");
    redirect("/");
  }
  return data.data;
}
