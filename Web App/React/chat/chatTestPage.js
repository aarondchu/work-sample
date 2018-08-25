//import * as React from "react";
//import { ChatBox } from "./ChatBox";
////import { ChatBox } from "./ChatBox";
//export interface IMessage {
//	sender: string,
//	message: string
//}
//interface IChatTestPageState {
//	messages: IMessage[],
//	messageField: string,
//	sender: string
//}
//export default class ChatTestPage extends React.Component<{}, IChatTestPageState>{
//	constructor(props) {
//		super(props);
//		this.state = {
//			messages: [],
//			messageField: "",
//			sender: ""
//		}
//	}
//	onChange = (fieldName: string, fieldValue: string) => {
//		let nextState = {
//			...this.state,
//			[fieldName]: fieldValue
//		};
//		this.setState(nextState);
//	}
//	onSubmit = (evt) => {
//		evt.preventDefault();
//		var chat = $.connection.chatHub;
//		chat.server.send(this.state.sender, this.state.messageField);
//	}
//	componentDidMount() {
//		var chat = $.connection.chatHub;
//		chat.client.addMessage = function (sender, text) {
//			const messages = this.state.messages;
//			messages.push({ sender: sender, message: text });
//			this.setState({ messages: messages });
//		}.bind(this);
//		$.connection.hub.start();
//	}
//	render() {
//		return (
//			<React.Fragment>
//				<h1>Chat</h1>
//				<ChatBox chatId={}/>
//			</React.Fragment>
//		)
//	}
//}
//# sourceMappingURL=chatTestPage.js.map