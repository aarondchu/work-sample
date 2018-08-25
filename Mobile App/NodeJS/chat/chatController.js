const chatService = require("./chatService");
const responses = require("../models/response")

const getUserChats = (req, res) => {
    chatService.getUserChats(req.params.userId)
        .then(result => res.json(new responses.itemsResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}
const getUserMessages = (req, res) => {
    chatService.getUserMessages(req.params.id, req.params.userId)
        .then(result => res.json(new responses.itemResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}
const addMessage = (req, res) => {
    chatService.addMessage(req.body, req.params.userId)
        .then(result => res.json(new responses.itemResponse(result)))
        .catch(err => res.status(500).send(new responses.errorResponse(err)));
}

module.exports = {
    getUserChats,
    getUserMessages,
    addMessage
}