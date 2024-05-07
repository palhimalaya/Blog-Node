import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
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
          localStorage.removeItem("token");
          setUser(null);
          toast.error("Your session has expired. Please log in again to continue.")
          navigate("/login")
          console.log(err);
        });
    }
  } , [token, setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="flex items-center justify-between p-5 bg-white sticky top-0 z-[999]">
      <div className="text-black font-bold">Blog</div>
      <div>
        <Link to="/" className={`mx-2 text-black  ${location.pathname === `/` ? "font-bold" : 'text-muted-foreground'}`}>
          Home
        </Link>
        {
          user && user.role === "admin" &&
          <Link to="/admin" className={`mx-2 text-black  ${location.pathname === `/admin` ? "font-bold" : 'text-muted-foreground'}`}>
            Admin
          </Link>
        }
      </div>
      {user ? (
        <div className="flex items-center">
          <span className="mx-2 text-black">{`Hello, ${user.full_name}`}</span>
          <button
            onClick={handleLogout}
            className="mx-2 px-4 py-2 text-sm text-black bg-white border border-gray-200 rounded shadow-md"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to="/login" className="mx-2 text-black">
            Login
          </Link>
          <Link to="/register" className="mx-2 text-black">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
