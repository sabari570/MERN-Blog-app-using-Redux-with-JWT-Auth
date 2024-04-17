import React, { useEffect, useState } from "react";
import DashboardPost from "../../components/dashboard-post/dashboardPost";
import "./dashboard.styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import Loader from "../../components/loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/users/${currentUser.id}`
        );
        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (error) {
        console.log("error while fetching the users posts: ", error);
        setIsLoading(false);
      }
    };
    fetchUserPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard-container">
          {posts.map((post) => {
            return <DashboardPost key={post._id} post={post} />;
          })}
        </div>
      ) : (
        <div className="container center">
          <h2>No posts found</h2>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
