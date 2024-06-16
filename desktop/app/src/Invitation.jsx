import axios from "axios";
import { Fragment, useState } from "react";
import { redirect, useLoaderData } from "react-router";
import notify from "./util/notify";
import styles from "./styles/invitation.module.css";

export default function Invitation() {
  const invitations = useLoaderData();
  const [filter, setFilter] = useState([]);
  async function reject(invitationid) {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/invite/reject",
        {
          invitationid: invitationid,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (!data.ok) throw new Error();
      setFilter((prevFilter) => [...prevFilter, invitationid]);
      notify(data.message);
    } catch (err) {
      console.log(err);
      notify("error occured");
    }
  }
  return (
    <Fragment>
      <div className={styles.container}>
        {invitations.map((item, i) => {
          const user = item.fromUser;
          if (filter.includes(item._id)) return <Fragment key={i} />;
          return (
            <div key={i} className={styles.card}>
              <div className={styles.row}>
                <span className={styles.username}>{user.username}</span>
                <span className={styles.username}>{user.email}</span>
              </div>
              <img
                src={determineProfileImage(user)}
                className={styles.profile}
              ></img>
              <button
                className={styles.reject}
                onClick={() => reject(item._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </button>
              <button className={styles.accept}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}
export async function loader() {
  try {
    let { data } = await axios.get(
      "http://localhost:8000/user/getcurrentuser",
      {
        withCredentials: true,
      }
    );
    const userid = data?.data?._id;
    if (!userid) throw new Error();

    const result = await axios.get(
      `http://localhost:8000/invite/find?userid=${userid}`,
      {
        withCredentials: true,
      }
    );
    const invitations = result?.data?.data;
    if (!invitations) throw new Error();
    return invitations;
  } catch (err) {
    redirect("/");
    notify("error occured");
  }
  return null;
}
function determineProfileImage(userData) {
  if (!userData.profileImage) return "./emptyprofile.jpg";
  return `http://localhost:8000/public/uploads/${userData.profileImage}`;
}
