import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layout/AppLayout.jsx";
import AuthLayout from "./Layout/AuthLayout.jsx";
import App from "./App.jsx";
import { loader as appLayoutLoader } from "./Layout/AppLayout.jsx";
import { loader as authLoader } from "./Layout/AuthLayout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchUser from "./SearchUser.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: appLayoutLoader,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/SearchUser",
        element: <SearchUser />,
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
