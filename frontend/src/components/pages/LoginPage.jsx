import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
// import Cookies from 'js-cookie';

function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",  
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate])
  


  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })

    if (formErrors[e.target.id]) {
      setFormErrors({
        ...formErrors,
        [e.target.id]: ""
      });
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setFormErrors({
      email: "",
      password: "",
    });
    let error = false
    // Validate form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      error = true;
    }

    if (formData.password.length < 6) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters",
      }));
      error = true;
    }
    // If no errors, submit form
    if (!error) {
      try {
        const response = await axios.post("/auth/login", formData);
        toast.success("Login successful")
        // Cookies.set('token', response.data.token)
        let token = response.data.token
        localStorage.setItem("token", token)
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
            });
        }
        navigate('/')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
    }
    }
  }
  return (
    <div className="flex h-[90vh] justify-center items-center">
      <form className="bg-white shadow-md rounded p-8 pt-6 pb-8 mb-4 w-[30rem]" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.email ? "border-red-500" : ""
            }`}
            id="email"
            type="email"
            placeholder="a@example.com"
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs italic">{formErrors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
             className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.password ? "border-red-500" : ""
            }`}
            id="password"
            type="password"
            placeholder="******************"
            onChange={handleChange}
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs italic">
              {formErrors.password}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
          <Link
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            to={"/reset-password"}
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
