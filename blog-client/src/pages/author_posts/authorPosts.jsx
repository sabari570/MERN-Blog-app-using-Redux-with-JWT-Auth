import React, { useEffect, useState } from "react";
import PostsItem from "../../components/posts-item/postsItem";
import "./authorPosts.styles.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";
import Loader from "../../components/loader/loader.component";

function AuthorPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchAuthorPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/users/${id}`
        );
        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (error) {
        console.log("Error while fetching posts of author: ", error);
        setError(error.response.data.error);
        setIsLoading(false);
      }
    };
    fetchAuthorPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="author-posts">
      {error && <p className="container form-error-message">{error}</p>}
      {posts.length > 0 ? (
        <div className="container author-posts-container">
          {posts.map((post) => (
            <PostsItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="container center">
          <h2>No posts found</h2>
        </div>
      )}
    </section>
  );
}

export default AuthorPosts;
