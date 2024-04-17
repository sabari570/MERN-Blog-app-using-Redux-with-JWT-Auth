import React from "react";
import { Link } from "react-router-dom";
import './errorpage.styles.css';
import  ErropageLogo from '../../assets/images/oops.png';

function ErrorPage() {
  return (
    <section className="error-page">
      <div className="center">
        <div className="error-page-thumbnail">
          <img src={ErropageLogo} alt="" />
        </div>
        <h2>404 - PAGE NOT FOUND</h2>
        <p>
          The page you are looking for might have been removed
          <br />
          had its name changed or is temporarily unavailable
        </p>
        <Link to='/' className="btn primary">GO TO HOMEPAGE</Link>
      </div>
    </section>
  );
}

export default ErrorPage;
