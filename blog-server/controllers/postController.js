const path = require("path");
const PostModel = require("../models/postModel");
const User = require("../models/userModel");
const { categoryList } = require("../constants/constants");
const fs = require("fs");

// ====================== CREATE A POST
// POST: api/posts/
// PROTECTED
module.exports.createPost = async (req, res) => {
  try {
    let { title, category, description } = req.body;

    if (!title || !category || !description || !req.files)
      throw { statusCode: 400, message: "All fields are mandatory" };

    category = category.toLowerCase();

    if (!categoryList.includes(category))
      throw { statusCode: 400, message: "Category provided is invalid" };

    const { thumbnail } = req.files;
    if (thumbnail.size > 2000000)
      throw {
        statusCode: 415,
        message: "File size is too big. Shoudl be less than 2MB",
      };

    const userId = req.userId;

    let filename = thumbnail.name;
    let splittedFilename = filename.split(".");
    let newFilename =
      splittedFilename[0] +
      "-" +
      Date.now().toString() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    //   moving the file to uploads folder
    thumbnail.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) throw { message: err };
      }
    );
    const createdPost = await PostModel.create({
      title,
      category,
      description,
      creator: userId,
      thumbnail: newFilename,
    });
    if (!createdPost)
      throw { statusCode: 400, message: "Post couldn't be created" };

    // find user and increase posts count by 1
    const currentUser = await User.findOne({ _id: userId });
    if (!currentUser) throw { statusCode: 400, message: "User not found" };

    const userPostCount = currentUser.posts + 1;
    await User.findByIdAndUpdate(userId, {
      posts: userPostCount,
    });
    return res.status(201).json(createdPost);
  } catch (error) {
    console.log("Error while creating a post: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== GET ALL POSTS
// GET: api/posts/
// UNPROTECTED
module.exports.getAllPosts = async (req, res) => {
  try {
    // fetching posts and sorting them in descending order (latest first)
    const posts = await PostModel.find().sort({ updatedAt: -1 });
    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error while fetching all posts: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== GET A SINGLE POST
// GET: api/posts/:id
// UNPROTECTED
module.exports.getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId);
    if (!post) throw { statusCode: 404, message: "Post not found" };

    return res.status(200).json({ post });
  } catch (error) {
    console.log("Error while fetching a post: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== GET POSTS BY CATEGOY
// GET: api/posts/categories/:category
// UNPROTECTED
module.exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const posts = await PostModel.find({
      category: category.toLowerCase(),
    }).sort({ updatedAt: -1 });
    if (!posts) throw { statusCode: 404, message: "Post not found" };

    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error while fetching a post by category: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== GET USER POSTS
// GET: api/posts/users/:id
// UNPROTECTED
module.exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await PostModel.find({ creator: userId }).sort({
      updatedAt: -1,
    });
    if (!posts) throw { statusCode: 404, message: "Post not found" };

    return res.status(200).json({ posts });
  } catch (error) {
    console.log("Error while fetching a post by user/author id: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== EDIT POST
// PATCH: api/posts/edit-post/:id
// PROTECTED
module.exports.editPost = async (req, res) => {
  try {
    let { title, category, description } = req.body;
    const postId = req.params.id;
    const userId = req.userId;

    if (!title || !category || !description)
      throw { statusCode: 400, message: "All fields are necessary" };

    category = category.toLowerCase();

    if (!categoryList.includes(category))
      throw { statusCode: 400, message: "Category provided is invalid" };

    const oldPost = await PostModel.findById(postId);
    if (!oldPost) throw { statusCode: 404, message: "Post not found" };
    if (userId == oldPost.creator) {
      if (!req.files) {
        const updatedPost = await PostModel.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            description,
          },
          {
            new: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Post updated successfully", updatedPost });
      } else {
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          (err) => {
            if (err) throw { message: err };
          }
        );

        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000)
          throw {
            statusCode: 415,
            message: "File size is too big. Shoudl be less than 2MB",
          };

        let filename = thumbnail.name;
        let splittedFilename = filename.split(".");
        let newFilename =
          splittedFilename[0] +
          "-" +
          Date.now().toString() +
          "." +
          splittedFilename[splittedFilename.length - 1];

        //   moving the file to uploads folder
        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFilename),
          async (err) => {
            if (err) throw { message: err };
          }
        );

        // now update the database with the new filename
        const updatedPost = await PostModel.findByIdAndUpdate(
          postId,
          {
            title,
            category,
            description,
            thumbnail: newFilename,
          },
          {
            new: true,
          }
        );
        return res
          .status(200)
          .json({ message: "Post updated successfully", updatedPost });
      }
    } else {
      throw { statusCode: 403, message: "Not allowed to edit this post" };
    }
  } catch (error) {
    console.log("Error while editing a post: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ====================== DELETE POST
// DELETE: api/posts/delete-post/:id
// PROTECTED
module.exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    const post = await PostModel.findById(postId);
    if (!post) throw { statusCode: 404, message: "Post not found" };

    if (post.creator != userId)
      throw {
        statusCode: 403,
        message: "User not allowed to delete this post",
      };
    if (post.thumbnail) {
      const filename = post.thumbnail;
      fs.unlink(path.join(__dirname, "..", "uploads", filename), (err) => {
        if (err) throw { message: err };
      });
    }
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (!deletedPost)
      throw {
        statusCode: 400,
        message: "Unable to delete the post",
      };
    // find user and reduce the post count by 1
    const user = await User.findById(userId);
    const userPostCount = user.posts - 1;
    const updatedUserPosCount = await User.findByIdAndUpdate(userId, {
      posts: userPostCount,
    });
    if (!updatedUserPosCount)
      throw {
        statusCode: 403,
        message: "Unable to update user count",
      };
    return res.status(200).json({ message: "Deleted post successfully" });
  } catch (error) {
    console.log("Error while delete a post: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};
