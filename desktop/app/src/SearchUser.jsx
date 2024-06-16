import { Fragment, useEffect, useRef, useState } from "react";
import SearchBar from "./Features/SearchUser/SearchBar";
import useDebounce from "./hooks/useDebounce";
import axios from "axios";
import styles from "./styles/SearchUser.module.css";
import Spinner from "./Components/Spinner.jsx";
import notify from "./util/notify.js";

export default function SearchUser() {
  const [page, setPage] = useState(0);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState();
  const debouncedQuery = useDebounce(query, 1000);
  useEffect(() => {
    if (!debouncedQuery) return;
    async function helper() {
      console.log(debouncedQuery);
      try {
        setIsLoading(true);
        const skip = page * 6;
        const limit = 6;
        const { data } = await axios.get(
          `http://localhost:8000/user/find?limit=${limit}&skip=${skip}&contains=${debouncedQuery}`,
          {
            withCredentials: true,
          }
        );
        // console.log(data);
        if (!data.ok) throw new Error();
        setUsers((prev) => [...prev, ...data.data]);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    helper();
  }, [debouncedQuery, page]);

  function handleScroll(e) {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setPage((prev) => prev + 1);
    }
  }
  async function request(userid) {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/user/invite",
        {
          userid: userid,
        },
        {
          withCredentials: true,
        }
      );
      notify("invitation send");
    } catch (err) {
      console.log(err);
      const msg = err?.response?.data?.error || "error occured";
      notify(msg);
    }
  }
  return (
    <Fragment>
      <SearchBar
        setQuery={setQuery}
        setUsers={setUsers}
        setPage={setPage}
      ></SearchBar>
      <div className={styles.userCardContainer} onScroll={handleScroll}>
        {users.map((user, i) => {
          return (
            <div key={i} className={styles.card}>
              <img
                className={styles.profileimg}
                src={determineProfileImage(user)}
              ></img>
              <p>{user.username}</p>
              <p>{user.email}</p>
              <button
                className={styles.request}
                onClick={() => request(user._id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
              </button>
            </div>
          );
        })}
        <br></br>
        {isLoading && <Spinner />}
      </div>
    </Fragment>
  );
}
function determineProfileImage(user) {
  if (!user.profileImage) return "./emptyprofile.jpg";
  return `http://localhost:8000/public/uploads/${user.profileImage}`;
}
