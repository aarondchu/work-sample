const forgotPasswordService = require("./forgotPasswordService");
const responses = require("../models/response")

const forgotPassword = (req, res) => {
    forgotPasswordService.forgotPassword(req.body)
        .then(result => res.json(new responses.itemResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}
module.exports = {
    forgotPassword
}