const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const userServices = require("../models/user-services");

dotenv.config();

async function checkUser(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.user = await userServices.findUserById(decodedToken.id);
                next();
            }
        });
    }
}

module.exports = checkUser;