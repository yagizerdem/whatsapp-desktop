import { Fragment, useState } from "react";
import axios from "axios";
import { useLoaderData, useNavigate, redirect } from "react-router";
import notify from "./util/notify";
import styles from "./styles/Profile.module.css";
function determineProfileImage(userData) {
  if (!userData.profileImage) return "./emptyprofile.jpg";
  return userData.profileImage;
}

export default function Profile() {
  const navigate = useNavigate();
  const userData = useLoaderData();
  const [profileImageSrc, setProfileImageSrc] = useState(() =>
    determineProfileImage(userData)
  );
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
      navigate("/Auth");
    } catch (err) {
      notify("error occured while log  out");
    }
  }
  return (
    <Fragment>
      <div className={styles.container}>
        <img src={profileImageSrc} className={styles.profile}></img>
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
