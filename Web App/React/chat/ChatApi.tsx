import ApiExecute from '../common/apiExecute';

const baseUrl = "";

const getUserMessages = (id) => {
    return ApiExecute(`${baseUrl}/api/chats/chats/messages/${id}`, "GET", null);
}
const addMessage = data => {
    return ApiExecute(`${baseUrl}/api/chats/messages`, "POST", data);
}
const getUserChats = () => {
    return ApiExecute(`${baseUrl}/api/chats/chats/user`, "GET", null);
}
const updateMessagesRead = (id) => {
	return ApiExecute(`${baseUrl}/api/chats/chats/read/${id}`, "GET", null);
}

export const ChatApi = {
	getUserMessages,
	addMessage,
	getUserChats,
	updateMessagesRead
}