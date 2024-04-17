// Handling unsupported routes
const notFound = (req, res, next) => {
  res.status(404).json({ error: `Not found - ${req.originalUrl}` });
};

//Handle user authentication errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // handling empty emails
  if (err.message === "email is empty") {
    errors.email = "Please enter an email";
  }

  // handling empty passwords
  if (err.message === "password is empty") {
    errors.password = "Please enter the password";
  }

  // handling incorrect email
  if (err.message === "incorrect email") {
    errors.email = "This email is not registered";
  }

  // handling incorrect password
  if (err.message === "incorrect password") {
    errors.password = "password entered is incorrect";
  }

  //Duplicate error code handling
  if (err.code == 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  // Validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// Post validation error
const handlePostValidationErrors = (error) => {
  let errors = {};
  if (error._message.includes("post validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = { handleErrors, notFound, handlePostValidationErrors };
