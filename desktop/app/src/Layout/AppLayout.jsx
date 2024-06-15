import { Outlet, redirect } from "react-router";
import axios from "axios";

export default function AppLayout() {
  return (
    <div>
      app layout
      <Outlet />
    </div>
  );
}
export async function loader() {
  const { data } = await axios.get("http://localhost:8000/auth/isLoggedIn", {
    withCredentials: true,
  });
  console.log("loader data", data);
  if (!data.ok) {
    return redirect("/Auth");
  }

  return null;
}
