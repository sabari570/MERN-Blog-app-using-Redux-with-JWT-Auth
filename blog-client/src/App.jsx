import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/layout";
import ErrorPage from "./pages/error_page/errorPage";
import HomePage from "./pages/home_page/home";
import PostDetail from "./pages/post_detail/postDetail";
import Register from "./pages/register_page/register";
import Login from "./pages/login_page/login";
import UserProfile from "./pages/user_profile/userProfile";
import Authors from "./pages/authors/authors";
import CreatePosts from "./pages/create_posts/createPosts";
import CategoryPosts from "./pages/category_posts/categoryPosts";
import AuthorPosts from "./pages/author_posts/authorPosts";
import Dashboard from "./pages/dashboard/dashboard";
import EditPosts from "./pages/edit_post/editPosts";
import DeletePost from "./pages/delete_post/deletePosts";
import Logout from "./pages/logout_page/logout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="posts/:id" element={<PostDetail />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="authors" element={<Authors />} />
        <Route path="create-post" element={<CreatePosts />} />
        <Route path="posts/categories/:category" element={<CategoryPosts />} />
        <Route path="posts/users/:id" element={<AuthorPosts />} />
        <Route path="myposts/" element={<Dashboard />} />
        <Route path="posts/edit/:id" element={<EditPosts />} />
        <Route path="posts/delete/:id" element={<DeletePost />} />
      </Route>
      {/* Error page */}
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
