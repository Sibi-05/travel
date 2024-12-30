import { Alert, Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiInformationCircle } from "react-icons/hi";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // updatedFormData is { name: "John", age: 25 , email: "john@example.com" }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear any previous error messages

    // Check for empty fields
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields!");
    }

    try {
      setLoading(true); // Set loading state
      const res = await axios.post("/api/auth/signin", formData);

      if (res.data.success === false) {
        return setErrorMessage(res.data.message || "Sign-In Failed!");
      }

      // Success - Perform redirect or display success message
      console.log("Sign-In successful:", res.data);

      setLoading(false);
      setFormData({});
      setErrorMessage(null);

      if (res.status == 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false); // Reset loading state
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
            <Button
              color="purple"
              type="submit"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
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
