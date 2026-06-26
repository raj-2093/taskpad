import React, { useEffect, useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { useApi } from "../../context/ApiProvider";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { api, user, setAccessToken, setUser } = useApi();

  const loginIds = {
    admin: {
      email: "admin@test.com",
      password: "123456",
    },
    karl: {
      email: "karl@test.com",
      password: "123456",
    },
    jessica: {
      email: "jessica@test.com",
      password: "123456",
    },
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // Login api call
    api
      .post(API_PATHS.AUTH.LOGIN, formData)
      .then((response) => {
        console.log(`login successfull`);
        const { loggedInUser, accessToken } = response.data.data;
        setAccessToken(accessToken);
        setUser(loggedInUser);
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Something went wrong. Please try again later");
          console.log(`login failed: ${error}`);
        }
      });
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    }
  }, [user]);

  return (
    <AuthLayout>
        <div className="absolute top-7 right-16">
          <select
            name="loginId"
            id="loginId"
            onChange={({ currentTarget }) => {
              const { email, password } = loginIds[currentTarget.value];
              setFormData({ ...formData, email, password });
            }}
            className="w-full border border-slate-300 rounded-md p-2 mb-4 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
          >
            <option value="">Select a test user</option>
            <option value="admin">Admin</option>
            <option value="karl">Karl (member)</option>
            <option value="jessica">Jessica (member)</option>
          </select>
        </div>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-600 mt-[5px] mb-6">
          Please enter your details to log in
        </p>


        <form onSubmit={handleLogin}>
          <Input
            value={formData.email}
            onChange={({ currentTarget }) =>
              setFormData({ ...formData, email: currentTarget.value })
            }
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={formData.password}
            onChange={({ currentTarget }) =>
              setFormData({ ...formData, password: currentTarget.value })
            }
            label="Password"
            placeholder="Min 8 characters"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account ?{" "}
            <Link className="font-medium text-primary underline" to={"/signup"}>
              Signup
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
