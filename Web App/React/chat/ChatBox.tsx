import * as React from "react";
//import { IMessage } from "./chatTestPage";
import { Message } from "./Message";
import { Input, Button } from "../common/form/index";
import { IncomingMessage } from "http";
import { ChatApi } from "./ChatApi";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

interface IChatBoxProps {
	chatId: number
}

export interface IMessageItem {
	sender: string;
	text: string;
};
interface IChatBoxState {
	messages: IMessageContent[],
	currentUserInfo: IChatUserInfo,
	messageText: string,
	chatId: number,
	chatUsersInfo: IChatUserInfo[],
	typing: string,
	room: string
}
export interface IChatUserInfo {
	id: number,
	firstName: string,
	lastName: string,
	avatarUrl: string,
}
export interface IMessageContent {
	id: number
	senderUserBaseId: number,
	chatId: number,
	message: string,
	sentDate: Date,
	messageRead: boolean,
	readDate: Date
	senderFirstName: string,
	picture: string
}

export class ChatBox extends React.Component<IChatBoxProps, IChatBoxState>{
	constructor(props) {
		super(props);
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
		}
	}
	onChange = (evt) => {
		let nextState = {
			...this.state,
			messageText: evt.target.value
		};
		let typingString = "";
		var chat = $.connection.chatHub;
		if (nextState.messageText.length == 1 && this.state.messageText.length == 0) {
			typingString = `${this.state.currentUserInfo.firstName} ${this.state.currentUserInfo.lastName} is Typing...`
			//chat.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
			chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
		}
		else if (nextState.messageText.length == 0 && this.state.messageText.length == 1) {
			//chat.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
			chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
		}
		this.setState(nextState)
	}
	onSubmit = () => {
		ChatApi.addMessage({ SenderUserBaseId: this.state.currentUserInfo.id, ChatId: this.state.chatId, Message: this.state.messageText })
			.then(res => {
				var chat = $.connection.chatHub;
				//var page = $.connection.loginHub;
				chat.server.send(this.state.messageText, this.state.currentUserInfo, this.state.chatId, 0, this.state.room);
				chat.server.sendTyping("", this.state.room, this.state.currentUserInfo.id);
				//page.server.updateUnreadMessages(`chat${this.state.chatId}`, this.state.chatId);
			})
			.catch(err => console.log(err));
	}
	onKeyPress = evt => {
		if (evt.keyCode == 13)
			this.onSubmit();
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
				else this.setUpChat();
			})
		}
	}
	setUpChat = () => {
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
				this.setState({ ...this.state, messages: messages, messageText: "" });
			};
			chat.client.setTyping = (typingString: string, id: number) => {
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
						this.setState({ ...this.state, messages: messages, chatUsersInfo: usersInfo, currentUserInfo: currentUser, room: groupName }, () => {
							$.connection.hub.start().done(() => {
								chat.server.joinRoom(this.state.room);
							});
							console.log($(`#messagesBottom`).position().top);
							$(".chat-messages").parent().animate({ scrollTop: $(`#messagesBottom`).position().top }, "slow")
						});
					}
					else throw new Error("No Chat Found")
				})
				.catch(err => console.log("Error:", err.message));
		}
	}
	componentDidMount() {
		this.setUpChat();;
	}
	render() {
		return (
			<React.Fragment>
				<div className="d-flex col flex-column">

					<div className="flex-grow-0 py-3 pr-4 pl-lg-4">

						<div className="media align-items-center">
							<a href="" className="chat-sidebar d-lg-none d-block text-muted text-large px-4 mr-2">
								<i className="ion ion-md-more"></i>
							</a>

							<div className="position-relative">
								{this.state.chatUsersInfo.map((user, idx) => (<img key={idx} src={user.avatarUrl} className="ui-w-40 rounded-circle" alt="" />))}
							</div>
							<div className="media-body pl-3">
								{/*<span className="badge badge-dot badge-success indicator" style={{ marginTop: "5px" }}></span>*/}
								<strong style={{ paddingLeft: "5px" }}>{this.state.chatUsersInfo.map((user, idx) => {
									let displayName = `${user.firstName} ${user.lastName}`;
									if (idx + 1 < this.state.chatUsersInfo.length)
										displayName = displayName + ", ";
									return displayName;
								})
								}</strong>
							</div>
							{/*<div>
								<button type="button" className="btn btn-default btn-round icon-btn">
									<i className="ion ion-ios-more"></i>
								</button>
							</div>*/}
						</div>

					</div>
					<hr className="flex-grow-0 border-light m-0" />

					<div className="flex-grow-1 position-relative">
						<PerfectScrollbar>
							<div className="chat-messages p-4" style={{ height: "-webkit-fill-available" }}>
								{this.state.messages.map((msg, idx) => <Message key={idx} message={msg} currentUserInfo={this.state.currentUserInfo} idx={idx} />)}
								<i className="text-muted">{this.state.typing ? this.state.typing : ""}</i>
								{/*<div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" style={{ left: "0px", width: "0px" }}></div></div>
								<div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" style={{ top: "0px", height: "0px" }}></div></div>*/}
								<div id="messagesBottom"></div>
							</div>
						</PerfectScrollbar>
					</div>

					<hr className="border-light m-0" />
					<div className="flex-grow-0 py-3 px-4">
						<div className="input-group">
							<input type="text" placeholder="Type your message" value={this.state.messageText} onChange={this.onChange} className="form-control chat-input" onKeyDown={this.onKeyPress} />
							<div className="input-group-append">
								<button type="button" className="btn btn-primary" onClick={this.onSubmit} >Send</button>
							</div>
						</div>
					</div>

				</div>
			</React.Fragment>
		)
	}
}