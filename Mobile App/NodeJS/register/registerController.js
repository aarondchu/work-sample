const registerService = require("./registerService");
const responses = require("../models/response")

const register = (req, res) => {
    registerService.register(req.body)
        .then(result => res.json(new responses.itemResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}
module.exports = {
    register
}