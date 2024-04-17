import React, { useEffect, useState } from "react";
import "./register.styles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";

function Register() {
  const INITIAL_USERDATA = {
    name: "",
    email: "",
    password: "",
    password2: "",
  };

  const [userData, setUserData] = useState(INITIAL_USERDATA);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(
    () => {
      if(currentUser){
        navigate('/');
      }
    },
    []
  );

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const registerUser = async (event) => {
    event.preventDefault();
    try {
      if (userData.password !== userData.password2) {
        setError("Passwords do not match");
        return;
      }
      const response = await axios.post(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/users/register`,
        userData
      );
      const newUser = await response.data;
      console.log("Response: ", newUser);
      if (!newUser) {
        setError("Couldn't register user. Please try again later");
        return;
      }
      setError("");
      navigate("/login");
    } catch (error) {
      console.log("Error while registering: ", error.response.data);
      let errorResponse = error.response.data;
      let errorMessage = "";
      if (errorResponse.name) {
        errorMessage = errorResponse.name;
      } else if (errorResponse.email) {
        errorMessage = errorResponse.email;
      } else if (errorResponse.password) {
        errorMessage = errorResponse.password;
      } else {
        errorMessage = errorMessage;
      }
      setError(errorMessage);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register-form" onSubmit={registerUser}>
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
            placeholder="Password"
            onChange={changeInputHandler}
            name="password"
            value={userData.password}
          />
          <input
            type="password"
            placeholder="Confirm password"
            onChange={changeInputHandler}
            name="password2"
            value={userData.password2}
          />
          <button className="btn primary">Register</button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  );
}

export default Register;
