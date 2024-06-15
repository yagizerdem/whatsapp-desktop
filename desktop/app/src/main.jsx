import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./Layout/AppLayout.jsx";
import AuthLayout from "./Layout/AuthLayout.jsx";
import App from "./App.jsx";
import { loader as appLayoutLoader } from "./Layout/AppLayout.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    ],
  },
  {
    path: "/Auth",
    element: <AuthLayout />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer />
  </React.StrictMode>
);
