const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { login, regenerateToken, register, logout, getUserData, changeAvatar, editUserProfile, getAuthors, getUserDataById } = require("../controllers/authController");

const router = Router();

// route for registering user
router.post('/register', register );

// route for logging users in
router.post('/login', login);

// route for re-generating token
router.post('/regenerate-token', regenerateToken );

// route for getting user profile
router.get('/', authMiddleware, getUserData);

// router to change the avatar
router.post('/change-avatar', authMiddleware, changeAvatar);

// router to update the user profile
router.patch('/edit-user', authMiddleware, editUserProfile);

// router to fetch the authors
router.get('/authors', getAuthors);

// route for getting user profile by id
router.get('/:id', getUserDataById);

// route for logging users out
router.post('/logout', logout);

module.exports = router;