import React, { useEffect, useState } from 'react'
import './postAuthor.styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URL_CONFIG } from '../../constants/constants';

// these imports are used to specify what time ago the user has posted the blog
// like 10 hours ago, 15 minutes ago, etc
import ReactTimeAgo from "react-time-ago";
import TimeAgo from 'javascript-time-ago';
import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

function PostAuthor({ authorId, updatedAt }) {
  const [authorData, setAuthorData] = useState({});
  console.log("Author id: ", authorId);

  useEffect(
    () => {
      const fetchAuthor = async () => {
        try {
          const response = await axios.get(`${URL_CONFIG.BLOG_APP_BASE_URL}/users/${authorId}`);
          setAuthorData(response?.data.user);
        } catch (error) {
          console.log("Error while fetching the author: ", error);
        }
      };
      fetchAuthor();
    },
    []
  );

  return (
    <Link to={`/posts/users/${authorId}`} className='post-author'>
        <div className="post-author-avatar">
            <img src={`${URL_CONFIG.BLOG_APP_ASSET_URL}/${authorData.avatar}`} alt=''/>
        </div>

        <div className="post-author-details">
            <h5>By {authorData.name}</h5>
            {/* This is how we use the time ago feature for react */}
            <small><ReactTimeAgo date={new Date(updatedAt)} locale="en-US" /></small>
        </div>
    </Link>
  )
}

export default PostAuthor
