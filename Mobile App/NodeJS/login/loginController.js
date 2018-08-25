const responses = require("../models/response");
const loginService = require("./loginService")

const login = (req, res) => {
    loginService.login(req.body)
        .then(result => res.json(new responses.loginResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}

const getUserInfo = (req, res) => {
    loginService.getUserInfo(req.userEmail, req.userId)
        .then(result => res.json(new responses.itemResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}

module.exports = {
    login,
    getUserInfo
};