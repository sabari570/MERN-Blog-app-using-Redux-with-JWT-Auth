import React from "react";
import "./loader.styles.css";

function Loader() {
  return (
    <section>
      <div className="loading-spinner">
        <img
          src="https://media.tenor.com/wpSo-8CrXqUAAAAi/loading-loading-forever.gif"
          alt="loader"
        />
      </div>
    </section>
  );
}

export default Loader;
