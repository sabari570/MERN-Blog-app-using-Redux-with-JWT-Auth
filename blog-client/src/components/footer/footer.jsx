import React from "react";
import "./footer.styles.css";
import { Link } from "react-router-dom";

function Footer() {
  const categoriesList = [
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
  return (
    <footer>
      <ul className="footer-categories">
        {categoriesList.map((category) => {
          return (
            <li key={category}>
              <Link to={`/posts/categories/${category.toLowerCase()}`}>{category}</Link>
            </li>
          );
        })}
      </ul>

      <div className="footer-copyright">
        <small>All Rights Reserved &copy; Copyright, SABARI dev.</small>
      </div>
    </footer>
  );
}

export default Footer;
