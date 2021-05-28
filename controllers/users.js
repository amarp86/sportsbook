const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const db = require("../db/connection");


db.on("error", console.error.bind(console, "MongoDB connection error:"));

const SALT_ROUNDS = 11 || process.env.SALT_ROUNDS;
const TOKEN_KEY = "longasskey2021" || process.env.TOKEN_KEY;

const signUp = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (await User.findOne({ email })) {
            res.status(400).json("User Already Exists");
        } else {
            const password_digest = await bcrypt.hash(
                password,
                parseInt(SALT_ROUNDS)
            );
            const user = new User({
                name,
                email,
                password_digest,
            });

            await user.save();

            const payload = {
                name: user.name,
                email: user.email,
            };

            const token = jwt.sign(payload, TOKEN_KEY);



            res.status(201).json({ token });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (await bcrypt.compare(password, user.password_digest)) {
            const payload = {
                name: user.name,
                email: user.email,
            };

            const token = jwt.sign(payload, TOKEN_KEY);
            res.status(201).json({ token });
        } else {
            res.status(401).send("Invalid Credentials");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verify = async(req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, TOKEN_KEY);
        if (payload) {
            res.json(payload);
        }
    } catch (e) {
        res.status(401).send("Not Authorized");
    }
};

module.exports = {
    signUp,
    signIn,
    verify,
};