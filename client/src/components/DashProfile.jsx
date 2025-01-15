import { Alert, TextInput } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../toolkit/user/userSlice";

export default function DashProfile() {
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Allowed extensions and size limit (e.g., 5 MB)
    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
    const maxSizeMB = 5;

    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

      if (isValidExtension && isValidType && isValidSize) {
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
        setImageFileUploadError(null);
      } else {
        if (!isValidExtension) {
          setImageFileUploadError(
            `Invalid file type. Allowed extensions: ${allowedExtensions.join(
              ", "
            )}`
          );
        } else if (!isValidSize) {
          setImageFileUploadError(`File size must be under ${maxSizeMB} MB.`);
        } else {
          setImageFileUploadError("Please select a valid image file.");
        }
        setImageFileUploadingProgress(null);
      }
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    if (!imageFile) return;
    setImageFileUploadError(null);
    const Data = new FormData();
    Data.append("file", imageFile); // Add the file to formData
    Data.append("upload_preset", "images"); // Replace with your Cloudinary upload preset
    Data.append("cloud_name", "dde983ikx"); // Replace with your Cloudinary cloud name

    try {
      // Send request to Cloudinary API
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dde983ikx/image/upload`,
        Data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            // Calculate upload progress
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            setImageFileUploadingProgress(progress.toFixed(0));
          },
        }
      );
      const { secure_url } = res.data;
      setImageFile(null);
      setImageFileUploadingProgress(null);
      setImageUrl(null);
      setFormData({ ...formData, profilePicture: secure_url });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setImageFileUploadError(error);
    }
  };
  // console.log(imageFile, imageUrl);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      console.log(currentUser);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("D", data);
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  console.log(formData);
  return (
    <div className="max-w-lg max-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className=" relative w-32 h-32  self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199),${
                    imageFileUploadingProgress / 100
                  }`,
                },
              }}
            />
          )}
          <img
            src={imageUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 object-cover border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="abc123@gmail.com"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="*********"
          onChange={handleChange}
        />
        <Button type="submit">Update</Button>
      </form>
      <div className="text-red-500 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="success" className="mt-5">
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
