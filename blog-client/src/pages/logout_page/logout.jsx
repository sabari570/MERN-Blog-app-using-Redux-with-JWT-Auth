import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../../../store/user/user-reducer";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setCurrentUser(null));
    navigate("/login");
  }, []);
  return <></>;
}

export default Logout;
