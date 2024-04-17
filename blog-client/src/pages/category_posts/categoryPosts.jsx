import React, { useEffect, useState } from "react";
import "./categoryPosts.styles.css";
import PostsItem from "../../components/posts-item/postsItem";
import Loader from "../../components/loader/loader.component";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function CategoryPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { category } = useParams();

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await axios.get(
          `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/categories/${category}`
        );
        setPosts(response.data.posts);
        setIsLoading(false);
      } catch (error) {
        console.log("Error while fetching posts by category: ", error);
        setError(error.response.data.error);
        setIsLoading(false);
      }
    };
    fetchCategoryPosts();
  }, [category]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="category-posts">
      {error && <p className="container form-error-message">{error}</p>}
      {posts.length > 0 ? (
        <div className="container category-posts-container">
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

export default CategoryPosts;
