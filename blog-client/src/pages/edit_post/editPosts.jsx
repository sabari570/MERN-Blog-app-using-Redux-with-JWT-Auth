import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";
import Loader from "../../components/loader/loader.component";

function EditPosts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);

  const [blogThumbnail, setBlogThumbnail] = useState();
  const [blogThumbnailImage, setBlogThumbnailImage] = useState();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const POST_CATEGORIES = [
    "Agriculture",
    "Business",
    "Education",
    "Entertainment",
    "Art",
    "Investment",
    "General",
    "Weather",
    "Technology",
  ];

  const blogThumbnailChangeHandler = (e) => {
    const file = e.target.files[0];
    setBlogThumbnailImage(URL.createObjectURL(file));
    setBlogThumbnail(file);
  };

  const categoryChangeHandler = (e) => {
    setCategory(e.target.value);
    console.log(e.target.value);
  };

  const blogTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const blogDescriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  // Captilizing the word
  const capitalizeFirstWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  useEffect(() => {
    const fetchPostById = async () => {
      setIsLoading(true);
      setError("");
      const response = await axios.get(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/${id}`
      );
      const post = response.data.post;
      setTitle(post?.title);
      setBlogThumbnail(post?.thumbnail);
      setBlogThumbnailImage(
        `${URL_CONFIG.BLOG_APP_ASSET_URL}/${post?.thumbnail}`
      );
      setDescription(post?.description);
      setCategory(capitalizeFirstWord(post?.category));
      console.log("category obtained: ", category);
      setIsLoading(false);
      try {
      } catch (error) {
        console.log("Error while fetching a post: ", error);
        setError(error.response.data.error);
        setIsLoading(false);
      }
    };
    fetchPostById();
  }, []);

  const updatePostHandler = async (event) => {
    event.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("description", description);
    postData.set("category", category);
    postData.set("thumbnail", blogThumbnail);
    try {
      setIsLoading(true);
      setError("");
      const response = await axios.patch(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/edit-post/${id}`,
        postData,
        // Setting up the headers for the post request
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );
      if (response.status == 200) {
        setIsLoading(false);
        return navigate("/");
      }
    } catch (error) {
      console.log("Error while updating a post: ", error);
      setError(error.response.data.error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="create-post-section">
      <div className="container create-post-container">
        <h2>Edit post</h2>
        {error && <p className="form-error-message">{error}</p>}
        <div className="blog-thumbnail">
          {blogThumbnail && (
            <img src={blogThumbnailImage} alt="blog thumbnail" />
          )}
        </div>
        <form className="form create-post-form" onSubmit={updatePostHandler}>
          <div className="create-post-thumbnail">
            <label htmlFor="create-blog-thumbnail">
              <FaPlus />
            </label>
            <input
              type="file"
              id="create-blog-thumbnail"
              onChange={blogThumbnailChangeHandler}
              accept=".png, .jpg, .jpeg"
            />

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={blogTitleHandler}
              autoFocus
            />
          </div>

          <select
            name="category"
            value={category}
            onChange={categoryChangeHandler}
          >
            {POST_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <textarea
            placeholder="Tell your story..."
            type="text"
            className="create-blog-textarea"
            rows="6"
            value={description}
            onChange={blogDescriptionHandler}
          />

          <button className="btn primary">Update</button>
        </form>
      </div>
    </section>
  );
}

export default EditPosts;
