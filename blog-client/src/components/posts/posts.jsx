import React, { useEffect, useState } from "react";
import "./posts.styles.css";
import PostsItem from "../posts-item/postsItem";
import Loader from "../loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${URL_CONFIG.BLOG_APP_BASE_URL}/posts`);
          setPosts(response?.data.posts);
          setIsLoading(false);
        } catch (error) {
          console.log("Error while fetching posts: ", error);
        }
      };
      fetchPosts();
    },
    []
  );

  if(isLoading){
    return < Loader />
  }
  return (
    <section className="posts">
      {
        (posts.length > 0 ? <div className="container posts-container">
        {posts.map((post) => (
          <PostsItem key={post._id} post={post} />
        ))}
      </div> :
      <div className="container">
        <h2>No posts found</h2>
      </div>)
      }
    </section>
  );
}

export default Posts;
