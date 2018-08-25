import * as React from "react";
//import { IMessage } from "./chatTestPage";
import { Message } from "./Message";
import { ChatApi } from "./ChatApi";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
;
export class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = (evt) => {
            let nextState = Object.assign({}, this.state, { messageText: evt.target.value });
            let typingString = "";
            var chat = $.connection.chatHub;
            if (nextState.messageText.length == 1 && this.state.messageText.length == 0) {
                typingString = `${this.state.currentUserInfo.firstName} ${this.state.currentUserInfo.lastName} is Typing...`;
                //chat.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
                chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
            }
            else if (nextState.messageText.length == 0 && this.state.messageText.length == 1) {
                //chat.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
                chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
            }
            this.setState(nextState);
        };
        this.onSubmit = () => {
            ChatApi.addMessage({ SenderUserBaseId: this.state.currentUserInfo.id, ChatId: this.state.chatId, Message: this.state.messageText })
                .then(res => {
                var chat = $.connection.chatHub;
                //var page = $.connection.loginHub;
                chat.server.send(this.state.messageText, this.state.currentUserInfo, this.state.chatId, 0, this.state.room);
                chat.server.sendTyping("", this.state.room, this.state.currentUserInfo.id);
                //page.server.updateUnreadMessages(`chat${this.state.chatId}`, this.state.chatId);
            })
                .catch(err => console.log(err));
        };
        this.onKeyPress = evt => {
            if (evt.keyCode == 13)
                this.onSubmit();
        };
        this.setUpChat = () => {
            if (this.state.chatId) {
                //var connection = $.hubConnection();
                //var chatProxy = connection.createHubProxy("chatHub");
                var chat = $.connection.chatHub;
                chat.client.addMessage = (text, user, chatId, messageId) => {
                    const messages = [...this.state.messages];
                    messages.push({
                        id: messageId,
                        senderUserBaseId: user.Id,
                        senderFirstName: user.FirstName,
                        chatId: chatId,
                        message: text,
                        sentDate: new Date(),
                        messageRead: false,
                        readDate: new Date(),
                        picture: user.AvatarUrl
                    });
                    this.setState(Object.assign({}, this.state, { messages: messages, messageText: "" }));
                };
                chat.client.setTyping = (typingString, id) => {
                    if (id != this.state.currentUserInfo.id)
                        this.setState({ typing: typingString });
                };
                ChatApi.getUserMessages(this.state.chatId)
                    .then(res => {
                    if (res.item) {
                        let usersInfo = res.item.usersInfo;
                        let currentUser = res.item.currentUserInfo;
                        let messages = res.item.messages.map((msg, idx) => {
                            let newMsg = msg;
                            if (msg.senderUserBaseId == currentUser.id) {
                                newMsg.senderFirstName = currentUser.firstName;
                                newMsg.picture = currentUser.avatarUrl;
                            }
                            else {
                                let info = usersInfo.find(userInfo => userInfo.id == msg.senderUserBaseId);
                                newMsg.senderFirstName = info.firstName;
                                newMsg.picture = info.avatarUrl;
                            }
                            return newMsg;
                        });
                        let groupName = `chatBox${this.state.chatId}`;
                        this.setState(Object.assign({}, this.state, { messages: messages, chatUsersInfo: usersInfo, currentUserInfo: currentUser, room: groupName }), () => {
                            $.connection.hub.start().done(() => {
                                chat.server.joinRoom(this.state.room);
                            });
                            console.log($(`#messagesBottom`).position().top);
                            $(".chat-messages").parent().animate({ scrollTop: $(`#messagesBottom`).position().top }, "slow");
                        });
                    }
                    else
                        throw new Error("No Chat Found");
                })
                    .catch(err => console.log("Error:", err.message));
            }
        };
        this.state = {
            messages: [],
            currentUserInfo: {
                id: 0,
                firstName: "",
                lastName: "",
                avatarUrl: "",
            },
            messageText: "",
            chatId: props.chatId,
            chatUsersInfo: [],
            typing: "",
            room: ""
        };
    }
    componentDidUpdate(oldProps) {
        if (oldProps.chatId != this.props.chatId) {
            this.setState({ chatId: this.props.chatId }, () => {
                if (this.state.room) {
                    var chat = $.connection.chatHub;
                    chat.server.leaveRoom(this.state.room).done(() => {
                        console.log("Left room: ", this.state.room);
                        this.setUpChat();
                    });
                }
                else
                    this.setUpChat();
            });
        }
    }
    componentDidMount() {
        this.setUpChat();
        ;
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "d-flex col flex-column" },
                React.createElement("div", { className: "flex-grow-0 py-3 pr-4 pl-lg-4" },
                    React.createElement("div", { className: "media align-items-center" },
                        React.createElement("a", { href: "", className: "chat-sidebar d-lg-none d-block text-muted text-large px-4 mr-2" },
                            React.createElement("i", { className: "ion ion-md-more" })),
                        React.createElement("div", { className: "position-relative" }, this.state.chatUsersInfo.map((user, idx) => (React.createElement("img", { key: idx, src: user.avatarUrl, className: "ui-w-40 rounded-circle", alt: "" })))),
                        React.createElement("div", { className: "media-body pl-3" },
                            React.createElement("strong", { style: { paddingLeft: "5px" } }, this.state.chatUsersInfo.map((user, idx) => {
                                let displayName = `${user.firstName} ${user.lastName}`;
                                if (idx + 1 < this.state.chatUsersInfo.length)
                                    displayName = displayName + ", ";
                                return displayName;
                            }))))),
                React.createElement("hr", { className: "flex-grow-0 border-light m-0" }),
                React.createElement("div", { className: "flex-grow-1 position-relative" },
                    React.createElement(PerfectScrollbar, null,
                        React.createElement("div", { className: "chat-messages p-4", style: { height: "-webkit-fill-available" } },
                            this.state.messages.map((msg, idx) => React.createElement(Message, { key: idx, message: msg, currentUserInfo: this.state.currentUserInfo, idx: idx })),
                            React.createElement("i", { className: "text-muted" }, this.state.typing ? this.state.typing : ""),
                            React.createElement("div", { id: "messagesBottom" })))),
                React.createElement("hr", { className: "border-light m-0" }),
                React.createElement("div", { className: "flex-grow-0 py-3 px-4" },
                    React.createElement("div", { className: "input-group" },
                        React.createElement("input", { type: "text", placeholder: "Type your message", value: this.state.messageText, onChange: this.onChange, className: "form-control chat-input", onKeyDown: this.onKeyPress }),
                        React.createElement("div", { className: "input-group-append" },
                            React.createElement("button", { type: "button", className: "btn btn-primary", onClick: this.onSubmit }, "Send")))))));
    }
}
//# sourceMappingURL=ChatBox.js.map