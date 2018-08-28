const jwt = require("jsonwebtoken");

const encodeData = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });
}

const verifyToken = (req, res, next) => {
    try {
        if (req.headers.ttoken) {
            const data = jwt.verify(req.headers.token, process.env.JWT_SECRET);
            req.userId = data.Id;
            req.userEmail = data.Email;
            next();
        }
        else throw new Error({
            name: "NoTokenFound",
            message: "Please login"
        })
    }
    catch (err) {
        throw new Error(err);
    }

}

module.exports = {
    verifyToken,
    encodeData
}