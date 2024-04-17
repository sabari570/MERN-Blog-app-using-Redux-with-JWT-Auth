const mongoose = require("mongoose");

// The blacklisted tokens will expire after 1 hour, created an index for this model to expire after 3600s
const tokenBlackListSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const TokenBlackList = mongoose.model("tokenBlackList", tokenBlackListSchema);

module.exports = TokenBlackList;
