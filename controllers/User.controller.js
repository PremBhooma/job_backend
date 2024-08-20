const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(207).json({
                errorcode: 2,
                status: false,
                message: "Email already in use",
                data: null,
            });
        }

        let role = "user";
        if (email.endsWith("@alphaware.com")) {
            role = "admin";
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        let newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        newUser = await newUser.save();

        return res.status(201).json({
            errorcode: 0,
            status: true,
            message: `${role === "admin" ? "Admin" : "User"} created successfully`,
            data: newUser,
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


        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(207).json({
                errorcode: 2,
                status: false,
                message: "Email doesn't exist",
                data: null,
            });
        }

        const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(207).json({
                errorcode: 3,
                status: false,
                message: "Incorrect password",
                data: null,
            });
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        existingUser = { ...existingUser._doc, password: null, token };

        return res.status(200).json({
            errorcode: 0,
            status: true,
            message: `${existingUser.role === "admin" ? "Admin" : "User"} logged in successfully`,
            data: existingUser,
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
