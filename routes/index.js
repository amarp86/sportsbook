const { Router } = require("express");

const usersRouter = require("./users");

const router = Router();

router.get("/", (req, res) => res.send("This is the api root!"));

router.use("/", usersRouter);


module.exports = router;