import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  SignInFailure,
} from "../toolkit/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    // updatedFormData is { name: "John", age: 25 , email: "john@example.com" }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SignInFailure(null));

    if (!formData.email || !formData.password) {
      return dispatch(SignInFailure("Please fill out all fields!"));
    }
    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/signin", formData);
      const data = await res.data;

      if (data.success === false) {
        dispatch(SignInFailure(data.message));
        console.log(data.message);
      }

      console.log("Sign-In successful:", data);

      if (res.status == 200) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(SignInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold dark:text-white border-purple-500 gap-2 text-4xl"
          >
            <span className="px-2 py-1 border-2 text-black border-purple-500 rounded-md">
              5181
            </span>
            <span className="text-purple-500">blog</span>
          </Link>
          <p className="text-sm mt-5">
            You can Log in to your account with your email and password or with
            Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                placeholder="abc123@gmail.com"
                id="email"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="*******"
                id="password"
                value={formData.password || ""}
                onChange={handleChange}
              />
            </div>
            <Button color="purple" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <OAuth />
          </form>
          {errorMessage && (
            <Alert className="mt-5" color="failure" icon={HiInformationCircle}>
              {errorMessage}
            </Alert>
          )}
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
