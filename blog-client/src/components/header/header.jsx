import React, { useState } from "react";
import "./header.styles.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/blog-logo.jpg";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import { setCurrentUser } from "../../../store/user/user-reducer";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  console.log("Current use obtained: ", currentUser?.name);

  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  const logOutUser = async () => {
    try {
      if (currentUser) {
        const response = await axios.post(
          `${URL_CONFIG.BLOG_APP_BASE_URL}/users/logout`,
          {
            accessToken: currentUser?.accessToken,
          }
        );
        dispatch(setCurrentUser(null));
        navigate("/login");
      } else {
        dispatch(setCurrentUser(null));
        navigate("/login");
      }
    } catch (error) {
      console.log("Error while logging out: ", error);
    }
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <nav>
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src={logo} alt="" />
          </Link>
          {currentUser && isNavShowing && (
            <ul className="nav-menu">
              <li>
                <Link to="/profile" onClick={closeNavHandler}>
                  {currentUser?.name}
                </Link>
              </li>
              <li>
                <Link to="/create-post" onClick={closeNavHandler}>
                  Create post
                </Link>
              </li>
              <li>
                <Link to="/authors" onClick={closeNavHandler}>
                  Authors
                </Link>
              </li>
              <li>
                <Link onClick={logOutUser}>
                  Logout
                </Link>
              </li>
            </ul>
          )}

          {!currentUser && isNavShowing && (
            <ul className="nav-menu">
              <li>
                <Link to="/authors" onClick={closeNavHandler}>
                  Authors
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={closeNavHandler}>
                  Login
                </Link>
              </li>
            </ul>
          )}

          <button
            className="nav-toggle-btn"
            onClick={() => setIsNavShowing(!isNavShowing)}
          >
            {isNavShowing ? <AiOutlineClose /> : <GiHamburgerMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;
