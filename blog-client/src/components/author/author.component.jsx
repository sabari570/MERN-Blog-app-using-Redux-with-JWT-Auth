import React from "react";
import "./author.styles.css";
import { Link } from "react-router-dom";
import { URL_CONFIG } from "../../constants/constants";

function Author({ author }) {
  const { _id, avatar, name, posts } = author;
  return <Link to={`/posts/users/${_id}`} className="author">
    <div className="author-avatar">
        <img src={`${URL_CONFIG.BLOG_APP_ASSET_URL}/${avatar}`} alt={name} />
    </div>

    <div className="author-info">
        <h4>{name}</h4>
        <p>{posts} posts</p>
    </div>

  </Link>;
}

export default Author;
