import React, { useEffect, useState } from "react";
import "./login.styles.css";
import { Link, useNavigate } from "react-router-dom";
import { URL_CONFIG } from "../../constants/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../../store/user/user-reducer";
import { selectCurrentUser } from "../../../store/user/user-selector";

function Login() {
  const INITIAL_USERDATA = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, []);

  const [userData, setUserData] = useState(INITIAL_USERDATA);
  const [error, setError] = useState("");

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const loginUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/users/login`,
        userData
      );
      const user = await response.data;
      console.log("Response: ", user);
      if (!user) {
        setError("Couldn't login user. Please try again later");
        return;
      }
      setError("");
      dispatch(setCurrentUser(user));
      navigate("/");
    } catch (error) {
      console.log("Error while logging in: ", error.response.data);
      let errorResponse = error.response.data;
      let errorMessage = "";
      if (errorResponse.email) {
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
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form register-form" onSubmit={loginUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            onChange={changeInputHandler}
            name="email"
            value={userData.email}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            onChange={changeInputHandler}
            name="password"
            value={userData.password}
          />
          <button className="btn primary">Login</button>
        </form>
        <small>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  );
}

export default Login;
