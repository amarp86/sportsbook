const jwt = require("jsonwebtoken");
const TOKEN_KEY = "longasskey2021" || process.env.TOKEN_KEY;

const restrict = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const data = jwt.verify(token, TOKEN_KEY);
        console.log(TOKEN_KEY)

        next();
    } catch (error) {
        console.log(error);
        res.status(403).send("Unauthorized");
    }
};

module.exports = restrict;