import { useEffect } from "react";

export default function useKey(userkey, callback) {
  useEffect(() => {
    document.addEventListener("keypress", ({ key }) => {
      if (key == userkey) callback();
    });
  }, [userkey, callback]);
}
