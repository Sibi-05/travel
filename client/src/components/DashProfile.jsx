import { Alert, Modal, TextInput } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "flowbite-react";
import { PiWarningCircleBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signInSuccess,
} from "../toolkit/user/userSlice";

export default function DashProfile() {
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      console.log(currentUser._id);
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);
      const data = res.data;
      console.log(data);
      if (res.status !== 200) {
        dispatch(deleteUserFailure(data));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await axios.post("api/user/signout");
      console.log(res);
      const data = res.data;
      if (res.status !== 200) {
        console.log(data.message);
      } else {
        dispatch(signInSuccess());
      }
    } catch (error) {
      console.log(error.message);
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
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign Out
        </span>
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
      {error && (
        <Alert color="success" className="mt-5">
          {error}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <PiWarningCircleBold className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are You Sure Do You Want To delete An Account!
            </h3>
            <div className="flex flex-row justify-center gap-14">
              <Button color="failure" onClick={handleDeleteUser}>
                yes, I'm Sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
