import { ApiExecute } from '../common/apiExecute';

const baseUrl = "http://localhost:8080";

const getUserMessages = (id, userId) => {
    return ApiExecute(`${baseUrl}/api/chat/${id}/${userId}`, "GET", null);
}
const addMessage = (data, userId) => {
    return ApiExecute(`${baseUrl}/api/chat/messages/${userId}`, "POST", data);
}
const getUserChats = (userId) => {
    return ApiExecute(`${baseUrl}/api/chat/user/${userId}`, "GET", null);
}
const updateMessagesRead = (id) => {
    return ApiExecute(`${baseUrl}/api/chats/chats/read/${id}`, "GET", null);
}//needs to be changed

export const ChatApi = {
    getUserMessages,
    addMessage,
    getUserChats,
    updateMessagesRead
}