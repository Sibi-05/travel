import { Alert, TextInput } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
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
    const formData = new FormData();
    formData.append("file", imageFile); // Add the file to formData
    formData.append("upload_preset", "images"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dde983ikx"); // Replace with your Cloudinary cloud name

    try {
      // Send request to Cloudinary API
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dde983ikx/image/upload`,
        formData,
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

      const { secure_url } = res.data; // Cloudinary response contains the secure_url
      setImageUrl(secure_url); // Set the Cloudinary URL
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setImageFileUploadError(error);
    }
  };
  console.log(imageFile, imageUrl);
  return (
    <div className="max-w-lg max-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        />
        <TextInput
          type="email"
          id="email"
          placeholder="abc123@gmail.com"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="*********" />
        <Button type="submit">Update</Button>
      </form>
      <div className="text-red-500 flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
