import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import HomePage from "./src/components/pages/HomePage";
import LoginPage from "./src/components/pages/LoginPage";
import HomeLayout from "./src/components/Layouts/HomeLayout";
import RegistrationPage from "./src/components/pages/RegistrationPage";
import PostDetailPage from "./src/components/pages/PostDetailPage";
import AdminPage from "./src/components/pages/AdminPage";
import PostForm from "./src/components/PostForm";
import axios from "axios";
import UnauthorizedPage from "./src/components/pages/UnauthorizedPage";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./src/context/UserContext";
import ForgotPassword from "./src/components/pages/ForgotPassword";
import ResetPasswordForm from "./src/components/ResetPasswordForm";

const RoleAccess = ({ roles }) => {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/auth/me", {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center item-center">Loading...</div>;
  }

  return !roles.length || roles.includes(user?.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "post/:id",
        element: <PostDetailPage />,
      },
      {
        path: "register",
        element: <RegistrationPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "reset-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordForm />,
      },
      {
        path: "unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "admin",
        element: (
          <RoleAccess
            roles={["admin"]}
          />
        ),
        children: [
          {
            path: "",
            element: <AdminPage />,
          },
        ],
      },
      {
        path: "create-post",
        element: (
          <RoleAccess
            roles={["admin"]}
          />
        ),
        children: [
          {
            path: "",
            element: <PostForm />,
          },
        ],
      },
      {
        path: "edit-post/:id",
        element: (
          <RoleAccess
            roles={["admin"]}
          />
        ),
        children: [
          {
            path: "",
            element: <PostForm />,
          },
        ],
      },
    ],
  },
]);

export default router;
