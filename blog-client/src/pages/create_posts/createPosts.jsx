import React, { useEffect, useState } from "react";
import "./create-post.styles.css";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../store/user/user-selector";
import Loader from "../../components/loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function CreatePosts() {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const blogTitleHandler = (e) => {
    setTitle(e.target.value);
  };

  const blogDescriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const createpost = async (event) => {
    event.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category.toLocaleLowerCase());
    postData.set("description", description);
    postData.set("thumbnail", blogThumbnail);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${URL_CONFIG.BLOG_APP_BASE_URL}/posts/`,
        postData,
        // Setting up the headers for the post request
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );
      if (response.status == 201) {
        setIsLoading(false);
        return navigate("/");
      }
    } catch (error) {
      console.log("Error while creating a post: ", error);
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
        <h2>Create post</h2>
        {error && <p className="form-error-message">{error}</p>}
        <div className="blog-thumbnail">
          {blogThumbnail && <img src={blogThumbnailImage} alt="blog thumbnail" />}
        </div>
        <form className="form create-post-form" onSubmit={createpost}>
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

            <input type="text" placeholder="Title" onChange={blogTitleHandler} autoFocus />
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
            onChange={blogDescriptionHandler}
          />

          <button className="btn primary">Publish</button>
        </form>
      </div>
    </section>
  );
}

export default CreatePosts;
