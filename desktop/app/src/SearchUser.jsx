import { Fragment, useEffect, useRef, useState } from "react";
import SearchBar from "./Features/SearchUser/SearchBar";
import useDebounce from "./hooks/useDebounce";
import axios from "axios";
import styles from "./styles/SearchUser.module.css";
import Spinner from "./Components/Spinner.jsx";

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
              <img className={styles.profileimg} src="./emptyprofile.jpg"></img>
              <p>{user.username}</p>
            </div>
          );
        })}
        <br></br>
        {isLoading && <Spinner />}
      </div>
    </Fragment>
  );
}
