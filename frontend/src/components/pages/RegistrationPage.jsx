import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const RegistrationPage = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (formErrors[e.target.id]) {
      setFormErrors({
        ...formErrors,
        [e.target.id]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    let isError = false;

    // Validate form data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        fullName: "Please enter your full name",
      }));
      isError = true;
    }

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email address",
      }));
      isError = true;
    }

    if (formData.password.length < 6) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters",
      }));
      isError = true;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      isError = true;
    }

    if (!isError) {
      try {
        const response = await axios.post("/auth/register", formData);
        const token = response.data.token;
        localStorage.setItem("token", token);
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
        navigate("/");
        toast.success("Registered Successfully!");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="flex h-[90vh] justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-8 pt-6 pb-8 mb-4 w-[30rem]"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.fullName ? "border-red-500" : ""
            }`}
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-xs italic">
              {formErrors.fullName}
            </p>
          )}
        </div>
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
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs italic">{formErrors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.password ? "border-red-500" : ""
            }`}
            id="password"
            type="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs italic">
              {formErrors.password}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
              formErrors.confirmPassword ? "border-red-500" : ""
            }`}
            id="confirmPassword"
            type="password"
            placeholder="******************"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-xs italic">
              {formErrors.confirmPassword}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
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
};

export default RegistrationPage;
