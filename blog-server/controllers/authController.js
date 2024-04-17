const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { handleErrors } = require("../utils/errorHandler");
const TokenBlackList = require("../models/tokenBlackListModel");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const ACCESS_TOKEN_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

// array that stores the valid refresh token
let refreshTokens = [];

// Function to create token
const createToken = (id) => {
  // creating access token that expires after every 15m
  const accessToken = jwt.sign({ id }, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "1d",
  });

  // creating refresh token that expires each day
  const refreshToken = jwt.sign({ id }, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "2d",
  });
  return { accessToken, refreshToken };
};

// ================== REGISTER A NEW USER
// POST: api/users/register
// UNPROTECTED
module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = createToken(user._id);
    const formattedUserObject = {
      id: user._id,
      name: user.name,
      emai: user.email,
    };
    res.status(201).json({
      ...formattedUserObject,
      "accessToken": accessToken,
      "refreshToken": refreshToken,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

// ================== LOGIN A REGISTERED USER
// POST: api/users/login
// UNPROTECTED
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) throw new Error("email is empty");
    if (!password) throw new Error("password is empty");
    const user = await User.login(email, password);
    const { accessToken, refreshToken } = createToken(user._id);

    // placing the refresh token inside the array
    refreshTokens.push(refreshToken);

    const formattedUserObject = {
      id: user._id,
      name: user.name,
      emai: user.email,
    };
    res.status(200).json({
      ...formattedUserObject,
      "accessToken": accessToken,
      "refreshToken": refreshToken,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

// ================== GENERATING THE ACCESS TOKEN FROM REFRESH TOKEN
// POST: api/users/regenerate-token
// UNPROTECTED
module.exports.regenerateToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated" });

  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json({ message: "Refresh token is not valid" });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY, (err, decodedToken) => {
    if (err)
      return res.status(403).json({ error: "Refresh token is not valid" });

    // remove the earlier refresh token placed in the array
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const tokens = createToken(decodedToken.id);
    const newAccessToken = tokens.accessToken;
    const newRefreshToken = tokens.refreshToken;
    refreshTokens.push(newRefreshToken);
    return res.status(200).json({
      "accessToken": newAccessToken,
      "refreshToken": newRefreshToken,
    });
  });
};

// ================== USER PROFILE
// GET: api/users/
// PROTECTED
module.exports.getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) throw { statusCode: 404, message: "User not found" };

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error while fetching the user: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};


// ================== GET USER PROFILE BY ID
// GET: api/users/:id
// UNPROTECTED
module.exports.getUserDataById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId }).select("-password");
    if (!user) throw { statusCode: 404, message: "User not found" };

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error while fetching the user: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};



// ================== CHANGE USER AVATAR (PROFILE PICTURE)
// POST: api/users/change-avatar
// PROTECTED
module.exports.changeAvatar = async (req, res) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  try {
    if (!req.files)
      throw { statusCode: 400, message: "Please choose an image" };

    const { avatar } = req.files;

    if (!allowedFileTypes.includes(avatar.mimetype))
      throw {
        statusCode: 415,
        message: "Unsupported fle type. Accepts only .jpeg, .jpg, .png formats",
      };

    const userId = req.userId;
    const user = await User.findOne({ _id: userId });

    if (!user) throw { statusCode: 404, message: "User not found" };

    // if this user has an avatar in the database then delete the file from the uploads folder
    // and then upload the new avatar to the folder and update the database
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) throw { statusCode: 404, message: err };
      });
    }

    if (avatar.size > 500000)
      throw {
        statusCode: 415,
        message: "File size is too big. Shoudl be less than 5KB",
      };

    let filename;
    filename = avatar.name;
    let splittedFilename = filename.split(".");
    let newFilename =
      splittedFilename[0] +
      "-" +
      Date.now().toString() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    // we then move the file to the uploads folder and if no error while uploading
    // then we add it to the database
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) throw { message: err };
      }
    );
    

    const updatedAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar: newFilename },
      { new: true }
    );

    if (!updatedAvatar)
      throw {
        statusCode: 400,
        message: "Updating avatar was unsuccessfully",
      };

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (error) {
    console.log("Error while changing the user avatar: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ================== EDIT USER DETAILS
// PATCH: api/users/edit-user
// PROTECTED
module.exports.editUserProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    if (
      !name ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    )
      throw { statusCode: 400, message: "All fields are necessary" };

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) throw { statusCode: 404, message: "User not found" };

    // make sure the new email doesnt exist
    const emailExist = await User.findOne({ email });
    if (emailExist && userId != emailExist._id)
      throw { statusCode: 403, message: "Email already exists" };

    // comparing current password to database password
    const isPasswordValidated = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValidated)
      throw {
        statusCode: 403,
        message: "Current password entered is incorrect",
      };

    // comparing new passwords
    if (newPassword != confirmNewPassword)
      throw { statusCode: 400, message: "Passwords do not match" };

    // hashing the new password
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUserProfile = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          name,
          email,
          password: hashedNewPassword,
        },
      },
      {
        new: true,
      }
    ).select(["-password", "-__v"]);

    if (!updatedUserProfile)
      throw { statusCode: 400, message: "Updating user profile failed" };

    return res
      .status(200)
      .json({
        message: "User profile updated successfully",
        updatedInfo: updatedUserProfile,
      });
  } catch (error) {
    console.log("Error while editing the user: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// ================== GET AUTHORS
// GET: api/users/authors
// UNPROTECTED
module.exports.getAuthors = async (req, res) => {
  try {
    const authors = await User.find().select("-password");
    return res.status(200).json({ authors });
  } catch (error) {
    console.log("Error while fetching the users/authors: ", error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};


// ================== LOGGING OUT USERS
// POST: api/users/logout
// UNPROTECTED
module.exports.logout = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken)
    return res.status(401).json({ message: "You are not authenticated" });

  try {
    await TokenBlackList.create({ token: accessToken });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.log("Error while logging out: ", err.message, err.code);
    if (err.code == 11000) {
      return res.status(400).json({ error: "Access Token already exists" });
    }
    return res.status(500).json({ message: "Something went wrong" });
  }
};
