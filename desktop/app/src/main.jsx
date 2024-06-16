import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layout/AppLayout.jsx";
import AuthLayout from "./Layout/AuthLayout.jsx";
import App from "./App.jsx";
import { loader as appLayoutLoader } from "./Layout/AppLayout.jsx";
import { loader as authLoader } from "./Layout/AuthLayout.jsx";
import { loader as profileLoader } from "./Profile.jsx";
import { loader as invitationLoader } from "./Invitation.jsx";
import { loader as appLoader } from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchUser from "./SearchUser.jsx";
import Profile from "./Profile.jsx";
import Invitation from "./Invitation.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: appLayoutLoader,
    children: [
      {
        path: "/",
        element: <App />,
        loader: appLoader,
      },
      {
        path: "/SearchUser",
        element: <SearchUser />,
      },
      {
        path: "/Profile",
        element: <Profile />,
        loader: profileLoader,
      },
      {
        path: "/Invitation",
        element: <Invitation />,
        loader: invitationLoader,
      },
    ],
  },
  {
    path: "/Auth",
    element: <AuthLayout />,
    loader: authLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
