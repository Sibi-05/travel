import { Button } from "flowbite-react";
import React from "react";
import { FaGoogle } from "react-icons/fa6";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { SignInFailure, signInSuccess } from "../toolkit/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // const res = await axios.post("/api/auth/google", {
      //   name: resultsFromGoogle.user.displayName,
      //   email: resultsFromGoogle.user.email,
      //   googlePhotoUrl: resultsFromGoogle.user.photoURL,
      // });
      console.log(resultsFromGoogle.user.displayName);
      const res = await axios.post("/api/auth/google", {
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        googlePhotoUrl: resultsFromGoogle.user.photoURL,
      });
      const data = await res.data;
      console.log(data);
      console.log("Raw Response:", data);
      if (res.status == 200) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(SignInFailure(error));
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      color="white"
      className="border border-gray-500"
      onClick={handleGoogleClick}
      outline
    >
      <FaGoogle className=" w-4 h-4 mr-2 " />
      <span>Sign In With Google</span>
    </Button>
  );
}
