import React, { useEffect, useState } from "react";
import "./userProfile.styles.css";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import Loader from "../../components/loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function UserProfile() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userAvatar, setUserAvatar] = useState();
  const [userAvatarImage, setUserAvatarmage] = useState();
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  let INITIAL_UPDATED_USERDATA = {
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  // checking whether the user is logged in
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);
  const [userData, setUserData] = useState(INITIAL_UPDATED_USERDATA);

  // fetching the user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await axios.get(
          `${URL_CONFIG.BLOG_APP_BASE_URL}/users/`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          }
        );
        const fetchedUserData = response.data.user;
        const combinedUserData = { ...userData, ...fetchedUserData };
        setUserData(combinedUserData);
        setUserAvatar(fetchedUserData?.avatar);
        setUserAvatarmage(
          `${URL_CONFIG.BLOG_APP_ASSET_URL}/${fetchedUserData?.avatar}`
        );
        setIsLoading(false);
      } catch (error) {
        console.log("Error while fetching user profile: ", error);
        setError(error.response.data.error);
      }
    };
    fetchUserProfile();
  }, []);

  // function to change the avatar inside the div
  const avatarChangeHandler = async (e) => {
    const file = e.target.files[0];
    setUserAvatarmage(URL.createObjectURL(file));
    setUserAvatar(file);
  };

  // function to change the avatar at backend
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(true);
    const postData = new FormData();
    console.log("User avatar: ", userAvatar);
    postData.set("avatar", userAvatar);
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.post(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );
      setIsAvatarTouched(true);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while changing avatar: ", error);
      setError(error.response.data.error);
      setIsLoading(false);
    }
  };

  // changing the user data inside the textfields
  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  // function to update the user data
  const updateUserProfile = async (event) => {
    event.preventDefault();
    const postData = new FormData();
    postData.set("name", userData.name);
    postData.set("email", userData.email);
    postData.set("currentPassword", userData.currentPassword);
    postData.set("newPassword", userData.newPassword);
    postData.set("confirmNewPassword", userData.confirmNewPassword);
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.patch(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/users/edit-user`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );
      setIsLoading(false);
      navigate(0);
    } catch (error) {
      console.log("Error while updating the user profile: ", error);
      setError(error.response.data.error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="user-profile">
      <div className="container profile-container">
        <Link to="/myposts" className="btn">
          My posts
        </Link>

        <div className="profile-details">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              {userAvatar && <img src={userAvatarImage} alt="user avatar" />}
            </div>

            <form className="avatar-form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={avatarChangeHandler}
                accept="png, jpg, jpeg"
              />
              {/* Icons for updating the avatar, by this we can actually pick the profile pic from our computer files */}
              {/* with this we can display: none the default choose file button in input type file */}
              <label htmlFor="avatar" onClick={(e) => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>

            {isAvatarTouched && (
              <button
                className="profile-avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>

          <h2>{userData.name}</h2>

          <form className="form profile-form" onSubmit={updateUserProfile}>
            {error && <p className="form-error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              onChange={changeInputHandler}
              name="name"
              value={userData.name}
              autoFocus
            />

            <input
              type="email"
              placeholder="Email"
              onChange={changeInputHandler}
              name="email"
              value={userData.email}
            />

            <input
              type="password"
              placeholder="Current password"
              onChange={changeInputHandler}
              name="currentPassword"
              value={userData.currentPassword}
            />

            <input
              type="password"
              placeholder="New password"
              onChange={changeInputHandler}
              name="newPassword"
              value={userData.newPasword}
            />

            <input
              type="password"
              placeholder="Confirm New password"
              onChange={changeInputHandler}
              name="confirmNewPassword"
              value={userData.confirmNewPassword}
            />

            <button type="submit" className="btn primary">
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
