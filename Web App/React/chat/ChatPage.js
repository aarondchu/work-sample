import * as React from "react";
import { ChatBox } from "./ChatBox";
import { ChatApi } from "./ChatApi";
import { ChatSideBarItem } from "./ChatSideBarItem";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
export default class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        //setupPageHub = () => {
        //	var page = $.connection.loginHub;
        //	page.client.updateUnread = (chatId: number) => {
        //		if (this.state.currentChat.id != chatId) {
        //			let newChats = this.state.chats.map(chat => {
        //				if (chat.id == chatId)
        //					chat.unread++;
        //				return chat;
        //			})
        //			this.setState({ chats: newChats }, () => {
        //				console.log("Updated Unread From Hub: ", this.state);
        //			});
        //		}
        //	}
        //	$.connection.hub.start().done(() => {
        //		this.state.chats.forEach(chat => {
        //			page.server.joinRoom(`chat${chat.id.toString()}`).done(() => console.log("Joined room:", `chat${chat.id.toString()}`))
        //		})
        //	})
        //}
        this.onClick = (chat) => {
            this.setState({ currentChat: chat } /*, () => this.updateMessagesRead()*/);
        };
        this.onChange = (search) => {
            this.setState({ searchText: search });
        };
        this.state = {
            chats: [],
            currentChat: {
                id: 0,
                users: [],
                unread: 0,
                newestMessage: ""
            },
            searchText: ""
        };
    }
    //updateMessagesRead = () => {
    //	if (this.state.currentChat.unread) {
    //		ChatApi.updateMessagesRead(this.state.currentChat.id)
    //			.then(res => {
    //				console.log("Success: ", res);
    //				let newCurrentChat = { ...this.state.currentChat };
    //				let newChats = this.state.chats.map(chat => {
    //					if (chat.id == this.state.currentChat.id) {
    //						chat.unread = 0;
    //						newCurrentChat = chat;
    //					}
    //					return chat;
    //				})
    //				this.setState({ ...this.state, chats: newChats, currentChat: newCurrentChat }, () => console.log("Update Unread Msgs", this.state));
    //			})
    //			.catch(err => console.log("Error: ", err));
    //	}
    //}
    componentDidMount() {
        ChatApi.getUserChats()
            .then(res => {
            if (res.items) {
                this.setState(Object.assign({}, this.state, { chats: res.items, currentChat: res.items[0] }), () => {
                    //this.updateMessagesRead();
                    //this.setupPageHub();
                });
            }
            else
                throw new Error("No Chats Found");
        })
            .catch(err => console.log("Error: ", err.message));
    }
    render() {
        return (React.createElement("div", { className: "container-fluid d-flex align-items-stretch flex-grow-1 p-0" },
            React.createElement("div", { className: "chat-wrapper container-p-x container-p-y container-fluid" },
                React.createElement("div", { className: "card flex-grow-1 position-relative overflow-hidden" },
                    React.createElement("div", { className: "row no-gutters h-100" },
                        React.createElement("div", { className: "chat-sidebox", style: { width: "250px" } },
                            React.createElement("div", { className: "flex-grow-0 px-4" },
                                React.createElement("div", { className: "media align-items-center" },
                                    React.createElement("div", { className: "media-body" },
                                        React.createElement("input", { type: "text", className: "form-control chat-search my-3", placeholder: "Search...", onChange: (e) => this.onChange(e.target.value) })),
                                    React.createElement("a", { href: "javascript:void(0)", className: "chat-sidebar d-lg-none d-block text-muted text-large font-weight-light pl-3" }, "\u00D7")),
                                React.createElement("hr", { className: "border-light m-0" })),
                            React.createElement("div", { className: "flex-grow-1 position-relative" },
                                React.createElement(PerfectScrollbar, null,
                                    React.createElement("div", { className: "chat-contacts list-group" },
                                        React.createElement(ChatSideBarItem, { chats: this.state.chats, onClick: this.onClick, search: this.state.searchText }))))),
                        this.state.currentChat ? React.createElement(ChatBox, { chatId: this.state.currentChat.id }) :
                            React.createElement("div", { className: "d-flex col flex-column" },
                                React.createElement("div", { className: "flex-grow-0 py-3 pr-4 pl-lg-4" },
                                    React.createElement("div", { className: "media align-items-center" },
                                        React.createElement("a", { href: "", className: "chat-sidebar d-lg-none d-block text-muted text-large px-4 mr-2" },
                                            React.createElement("i", { className: "ion ion-md-more" })),
                                        React.createElement("div", { className: "position-relative" }),
                                        React.createElement("div", { className: "media-body pl-3" },
                                            React.createElement("strong", { style: { paddingLeft: "5px" } })))),
                                React.createElement("hr", { className: "flex-grow-0 border-light m-0" }),
                                React.createElement("div", { className: "flex-grow-1 position-relative" },
                                    React.createElement(PerfectScrollbar, null,
                                        React.createElement("div", { className: "chat-messages p-4", style: { height: "-webkit-fill-available" } },
                                            React.createElement("div", { className: "flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3 mr-3" }, "No Chats Found..."),
                                            React.createElement("div", { id: "messagesBottom" })))),
                                React.createElement("hr", { className: "border-light m-0" }),
                                React.createElement("div", { className: "flex-grow-0 py-3 px-4" },
                                    React.createElement("div", { className: "input-group" },
                                        React.createElement("input", { type: "text", disabled: true, placeholder: "Type your message", className: "form-control chat-input" }),
                                        React.createElement("div", { className: "input-group-append" },
                                            React.createElement("button", { type: "button", className: "btn btn-primary" }, "Send"))))))))));
    }
}
//# sourceMappingURL=ChatPage.js.map