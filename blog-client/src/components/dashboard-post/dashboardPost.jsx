import React from "react";
import "./dashboard.post.styles.css";
import { Link } from "react-router-dom";
import { URL_CONFIG } from "../../constants/constants";
import DeletePosts from "../../pages/delete_post/deletePosts";

function DashboardPost({ post }) {
  const { _id, thumbnail, title } = post;
  return (
    <div className="dashboard-post-container">
      <div className="dashboard-post-info">
        <div className="dashboard-thumbail">
          <img src={`${URL_CONFIG.BLOG_APP_ASSET_URL}/${thumbnail}`} alt="" />
        </div>
        <h5>{title}</h5>
      </div>

      <div className="dashboard-post-actions">
        <Link to={`/posts/${_id}`}>
          <button className="btn sm">View</button>
        </Link>

        <Link to={`/posts/edit/${_id}`}>
          <button className="btn primary sm">Edit</button>
        </Link>

        < DeletePosts postId={_id} btnClass={"btn danger sm"} />
      </div>
    </div>
  );
}

export default DashboardPost;
