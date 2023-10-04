import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, SetFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        SetFilePerc(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl font-semibold text-center my-7">Profile</h1>
      <form className=" flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
          type="file"
          ref={fileRef}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <div className=" text-sm self-center">
          {fileUploadError ? (
            <span className=" text-red-700">
              Error Image upload(image must be less than 2Mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className=" text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <p className="text-green-700">Image upload successful</p>
          ) : (
            ""
          )}
        </div>
        <input
          id="username"
          type="text"
          placeholder="username"
          className=" border p-3 rounded-lg"
        />
        <input
          id="email"
          type="email"
          placeholder="email"
          className=" border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          className=" border p-3 rounded-lg"
        />
        <button className=" bg-slate-700 p-3 uppercase text-white hover:opacity-95 rounded-lg disabled:opacity-80">
          Update
        </button>
      </form>
      <div className=" flex justify-between mt-5 ">
        <span className=" text-red-700 cursor-pointer  ">Delete Account</span>
        <span className=" text-red-700 cursor-pointer  ">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
