import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function DeletePosts({ postId, btnClass }) {
  const currentUser = useSelector(selectCurrentUser);

  // This useLocation() hook is used to identify from which route are we coming to this component
  // delete component in used in two places one is the view post page and the other one is the dashboard page
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  const deletePostById = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/delete-post/${postId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );
      if(response.status == 200){
        // check from where this route is coming
        // if coming from dashboard we just refresh that particular page
        if(location.pathname == `/myposts`){
          // this is how we refresh the page using navigate
          navigate(0);
        }else if(location.pathname == `/posts/${postId}`){
          // navigate to home page
          navigate('/');
        }

        // else if from view post page then we navigate to the home page
      }
    } catch (error) {
      console.log("Error while deleting a post: ", error);
      setIsLoading(false);
    }
  };

  return <button className={(!btnClass) ? "btn danger" : btnClass} onClick={deletePostById}>Delete</button>;
}

export default DeletePosts;
