import { Fragment, useRef } from "react";
import styles from "../../styles/SearchUser.module.css";
import useKey from "../../hooks/useKey";
export default function SearchBar() {
  const ref = useRef();
  useKey("Enter", () => ref.current.focus());
  return (
    <Fragment>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="enter username for search"
          ref={ref}
        ></input>
      </div>
    </Fragment>
  );
}
