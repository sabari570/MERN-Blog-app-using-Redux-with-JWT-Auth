const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createPost, getAllPosts, getPost, getPostsByCategory, getUserPosts, editPost, deletePost } = require("../controllers/postController");

const router = Router();

// route for creating a new post
router.post('/', authMiddleware, createPost);

// route for fetching all posts
router.get('/',  getAllPosts);

// route for fetching a single post
router.get('/:id', getPost);

// route for fetching posts by category
router.get('/categories/:category', getPostsByCategory);

// route for fetching users posts
router.get('/users/:userId', getUserPosts);

// router for editing a post
router.patch('/edit-post/:id', authMiddleware, editPost);

// router for deleting a post
router.delete('/delete-post/:id', authMiddleware, deletePost);


module.exports = router;