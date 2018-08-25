const db = require("../../dbController");
const authService = require("../jwtAuthorization/authorizationService");

const getUserMessages = (chatId, userId) => {
    let params = [];
    let promises = [];
    let info = [];
    db.buildParams(params, "chatid", db.TYPES.Int, chatId);
    db.buildParams(params, "userId", db.TYPES.Int, userId);
    return db.executeQuery("dbo.Chat_GetUsersAndMessagesByChatId", params)
        .then(res => {
            let currentUser = res[0];
            let users = res.filter(item => item.firstName != undefined && item && item.id != currentUser.id);
            let messages = res.filter(item => item.message != undefined)
            return {
                currentUserInfo: currentUser,
                usersInfo: users,
                messages: messages
            }
        })
        .catch(err => console.log("Error in getting chat users info", err))
}
const getUserChats = (userId) => {
    let params = [];
    let info = [];
    let promises = [];
    db.buildParams(params, "id", db.TYPES.Int, userId)
    return db.executeQuery("dbo.Chat_GetAllChatsForUser", params)
        .then(res => {
            let recentMessages = res.filter(item => item.message != undefined);
            let unread = res.filter(item => item.unread != undefined);
            let userInfos = res.filter(item => item.firstName != undefined)
            let userIds = res.filter(item => item.userBaseId != undefined && item.chatId != undefined);
            userIds.forEach(ids => {
                if (info.some(item => item.id == ids.chatId)) {
                    let chat = info.some(item => item.id == ids.chatId);
                    if (chat.users.every(user => user.id != ids.userBaseId)) {
                        chat.users.push(userInfos.find(info => info.id == ids.userBaseId))
                    }
                }
                else {
                    let users = [];
                    users.push(userInfos.find(info => info.id == ids.userBaseId));
                    info.push({
                        id: ids.chatId,
                        users: users,
                        unread: unread.find(item => item.chatId == ids.chatId) ? unread.find(item => item.chatId == ids.chatId).unread : 0,
                        newestMessage: recentMessages.find(item => item.chatId == ids.chatId) ? recentMessages.find(item => item.chatId == ids.chatId).message : ""
                    })
                }
            })
            return info;
        })
        .catch(err => console.log("Error in getting user chats", err))
}
const addMessage = (data, userId) => {
    let params = [];
    db.buildParams(params, "senderUserBaseId", db.TYPES.Int, data.senderUserBaseId);
    db.buildParams(params, "message", db.TYPES.NVarChar, data.message);
    db.buildParams(params, "chatId", db.TYPES.Int, data.chatId);
    db.buildParams(params, "id", db.TYPES.Int, 0, true);
    return db.executeNonQuery("dbo.ChatMessage_Insert", params)
        .then(res => res.id)
        .catch(err => console.log("Error in getting unread messages", err))
}

module.exports = {
    getUserChats,
    getUserMessages,
    addMessage
}