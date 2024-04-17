import React, { useEffect, useState } from "react";
import "./authors.styles.css";
import AUTHORS_DATA from "../../constants/authors_data";
import Author from "../../components/author/author.component";
import Loader from "../../components/loader/loader.component";
import axios from "axios";
import { URL_CONFIG } from "../../constants/constants";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      const fetchAuthors = async () => {
        try {
          setError("");
          setIsLoading(true);
          const response = await axios.get(`${URL_CONFIG.BLOG_APP_BASE_URL}/users/authors`);
          setAuthors(response.data.authors);
          setIsLoading(false);
        } catch (error) {
          console.log("Error while fetching authors: ", error);
          setError(error.response.data.error);
          setIsLoading(false);
        }
      };
      fetchAuthors();
    },
    []
  );

  if(isLoading){
    return < Loader />
  }

  return (
    <section className="authors">
    {
      authors.length > 0 ?
      <div className="container authors-container">
          {
            authors.map((author) => {
              return < Author key={author._id} author={author} />
            })
          }
      </div> :
      <div className="container center">
        <h2>No Authors found</h2>
      </div>
    }
  </section>
  );
}

export default Authors;
