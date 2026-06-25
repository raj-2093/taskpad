import React, { useEffect, useState } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import { useApi } from "../../context/ApiProvider";
import { useUploadImage } from "../../hooks/useUploadImage";

export default function Signup() {
  const [formData, setFormData] = useState({
    profilePic: null,
    fullName: "",
    email: "",
    password: "",
    adminInviteToken: "",
  });

  const [error, setError] = useState(null);
  const { api, setLoading, setAccessToken, user, setUser } = useApi();
  const { uploadImage } = useUploadImage();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!formData.fullName) {
      setError("Please enter full name.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // Signup API call
    if (formData.profilePic) {
      const imgUploadRes = await uploadImage(formData.profilePic);
      profileImageUrl = imgUploadRes || "";
    }

    api
      .post(API_PATHS.AUTH.SIGNUP, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        profileImageUrl,
        adminInviteToken: formData.adminInviteToken,
      })
      .then((response) => {
        console.log(`signup successful`);
        const { createdUser, accessToken } = response.data.data;
        setAccessToken(accessToken);
        setUser(createdUser);
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

  const setProfilePic = (pic) => {
    setFormData({ ...formData, profilePic: pic });
  };

  useEffect(() => {
    if(user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    }
  }, [user]);

  return (
    <AuthLayout>
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>
          <ProfilePhotoSelector
            image={formData.profilePic}
            setImage={setProfilePic}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={formData.fullName}
              onChange={({ currentTarget }) =>
                setFormData({ ...formData, fullName: currentTarget.value })
              }
              label={"Full Name"}
              placeholder={"John Doe"}
              type={"text"}
            />

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

            <Input
              value={formData.adminInviteToken}
              onChange={({ currentTarget }) =>
                setFormData({
                  ...formData,
                  adminInviteToken: currentTarget.value,
                })
              }
              label="Admin Invite Token"
              placeholder="6 Digit Code"
              type="text"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account ?{" "}
            <Link className="font-medium text-primary underline" to={"/login"}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
