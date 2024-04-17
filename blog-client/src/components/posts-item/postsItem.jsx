import React from "react";
import "./postItem.styles.css";
import { Link } from "react-router-dom";
import PostAuthor from "../post-author/postAuthor";
import { URL_CONFIG } from "../../constants/constants";

function PostsItem({ post }) {
  const { _id, thumbnail, category, title, description, creator, createdAt, updatedAt } = post;
  const shortTitle = title.length > 30 ? title.substr(0, 30) + "..." : title;
  const shortDescription =
    description.length > 145 ? description.substr(0, 145) + "..." : description;
  return (
    <article className="post">
      <div className="post-thumbnail">
        <img src={`${URL_CONFIG.BLOG_APP_ASSET_URL}/${thumbnail}`} alt={title} />
      </div>

      <div className="post-content">
        <Link to={`/posts/${_id}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p>{shortDescription}</p>
      </div>

      <div className="post-footer">
        <PostAuthor authorId={creator} updatedAt={updatedAt} />
        <Link to={`/posts/categories/${category}`} className="btn category">
          {category}
        </Link>
      </div>
    </article>
  );
}

export default PostsItem;
