const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(207).json({
        errorcode: 1,
        status: false,
        message: "Please provide all required fields.",
        data: null,
      });
    }

    let userExit = await User.findOne({ email: email });
    if (userExit)
      return res.status(207).json({
        errorcode: 6,
        status: false,
        message: "Email already exist",
        data: null,
      });

    // if (password.length < 4 || password.length > 10) {
    //   return res.status(207).json({
    //     errorcode: 2,
    //     status: false,
    //     message: "Password must be between 4 and 10 characters",
    //     data: null,
    //   });
    // }

    // const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    // if (!passwordPattern.test(password)) {
    //   return res.status(207).json({
    //     errorcode: 3,
    //     status: false,
    //     message: "Password must contain at least one alphabet character, one numeric character, and one special symbol",
    //     data: null,
    //   });
    // }

    // Validation for Check the email format
    // const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    // if (!emailPattern.test(email)) {
    //   return res.status(207).json({
    //     errorcode: 4,
    //     status: false,
    //     message: "Invalid email format.",
    //     data: null,
    //   });
    // }

    const hashedPassword = bcrypt.hashSync(password);

    let new_user = new User({
      name,
      email,
      password: hashedPassword,
      provider: "user"
    });

    new_user = await new_user.save();

    return res.status(201).json({
      errorcode: 0,
      status: true,
      message: "User Added Successfully",
      data: new_user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      errorcode: 5,
      status: false,
      message: error.message,
      data: error,
    });
  }
};

exports.createOauthUser = async (req, res) => {
  try {
    const { name, email, provider } = req.body;

    // Check if the user already exists in the database
    let existingUser = await User.findOne({ email });
    let userResponse;
    let message;
    let token;
    if (!existingUser) {
      // Create a new user if not found
      let newUser = new User({
        name,
        email,
        provider,
      });

      newUser = await newUser.save();
      userResponse = newUser;
      message = "New user created successfully"; // Message for new user creation
      token = jwt.sign({ userid: existingUser }, process.env.JWT_SECRET, { expiresIn: "30s" });
    } else {
      // If user exists, return the existing user
      userResponse = existingUser;
      message = "User already exists, logged in successfully"; // Message for existing user
      token = jwt.sign({ userid: existingUser }, process.env.JWT_SECRET, { expiresIn: "30s" });
    }

    return res.status(201).json({
      errorcode: 0,
      status: true,
      message: message, // Return specific message
      data: { userResponse, token },
    });
  } catch (error) {
    return res.status(500).json({
      errorcode: 5,
      status: false,
      message: error.message,
      data: error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (!user)
      return res.status(207).json({
        errorcode: 1,
        status: false,
        message: "Email doesn't exists",
        data: null,
      });

    let cmpPassword = bcrypt.compareSync(password, user.password);
    if (!cmpPassword) {
      return res.status(207).json({
        errorcode: 2,
        status: false,
        message: "Incorrect Password",
        data: null,
      });
    } else {
      const token = jwt.sign({ userid: user }, process.env.JWT_SECRET, { expiresIn: "30s" });
      return res.status(201).json({
        errorcode: 0,
        status: true,
        message: "User Login Successfully",
        data: { user, token },
      });
    }
  } catch (error) {
    return res.status(500).json({
      errorcode: 5,
      status: false,
      message: error.message,
      data: error,
    });
  }
};
