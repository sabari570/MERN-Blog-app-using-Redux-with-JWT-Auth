import React, { useEffect, useState } from "react";
import "./postDetail.styles.css";
import PostAuthor from "../../components/post-author/postAuthor";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import Loader from "../../components/loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";
import DeletePosts from "../delete_post/deletePosts";

function PostDetail() {
  // inorder to fetch the id from URL params use the hook useParams
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = useSelector(selectCurrentUser);

  useEffect(
    () => {
      const fetchSinglePost = async () => {
        try {
          setError("");
          setIsLoading(true);
          const response = await axios.get(`${URL_CONFIG.BLOG_APP_BASE_URL}/posts/${id}`);
          setPost(response.data.post);
          setIsLoading(false);
        } catch (error) {
          console.log("Error while fetching a post: ", error.response.data);
          setError(error.response.data.error);
          setIsLoading(false);
        }
      };
      fetchSinglePost();
    },
    []
  );

  const navigateHandler = (pathToNavigate) => {
    navigate(pathToNavigate);
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="post-detail">
      {error && <p className="container form-error-message">{error}</p>}
      {post && (
        <div className="container post-detail-container">
          <div className="post-detail-header">
          <PostAuthor authorId={post.creator} updatedAt={post.updatedAt} />
            {currentUser?.id == post?.creator && (
              <div className="post-detail-buttons">
                <button
                  className="btn primary"
                  onClick={() => navigateHandler(`/posts/edit/${id}`)}
                >
                  Edit
                </button>
                < DeletePosts postId={id} />
              </div>
            )}
          </div>

          <h2>{post.title}</h2>
          <div className="post-detail-thumbnail">
            <img src={`${URL_CONFIG.BLOG_APP_ASSET_URL}/${post.thumbnail}`} alt="Post Thumbnail" />
          </div>
          <p>
           {post.description}
          </p>
        </div>
      )}
    </section>
  );
}

export default PostDetail;
