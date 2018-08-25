import * as React from "react";
import { ChatBox, IChatUserInfo } from "./ChatBox";
import { ChatApi } from "./ChatApi";
import { ChatSideBarItem } from "./ChatSideBarItem";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
interface IChatPageState {
	chats: IChatGroup[],
	currentChat: IChatGroup,
	searchText: string
}
export interface IChatGroup {
	id: number,
	users: IChatUserInfo[],
	unread: number,
	newestMessage: string
}

export default class ChatPage extends React.Component<{}, IChatPageState>{
	constructor(props) {
		super(props);
		this.state = {
			chats: [],
			currentChat: {
				id: 0,
				users: [],
				unread: 0,
				newestMessage: ""
			},
			searchText: ""
		}
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
					this.setState({ ...this.state, chats: res.items, currentChat: res.items[0] }, () => {
						//this.updateMessagesRead();
						//this.setupPageHub();
					});
				}
				else throw new Error("No Chats Found");
			})
			.catch(err => console.log("Error: ", err.message))
	}
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
	onClick = (chat: any) => {
		this.setState({ currentChat: chat }/*, () => this.updateMessagesRead()*/);
	}
	onChange = (search: string) => {
		this.setState({ searchText: search });
	}
	render() {
		return (
			<div className="container-fluid d-flex align-items-stretch flex-grow-1 p-0">

				<div className="chat-wrapper container-p-x container-p-y container-fluid">

					<div className="card flex-grow-1 position-relative overflow-hidden">
						<div className="row no-gutters h-100">
							<div className="chat-sidebox" style={{ width: "250px" }}>

								<div className="flex-grow-0 px-4">
									<div className="media align-items-center">
										<div className="media-body">
											<input type="text" className="form-control chat-search my-3" placeholder="Search..." onChange={(e) => this.onChange(e.target.value)} />
										</div>
										<a href="javascript:void(0)" className="chat-sidebar d-lg-none d-block text-muted text-large font-weight-light pl-3">×</a>
									</div>
									<hr className="border-light m-0" />
								</div>

								<div className="flex-grow-1 position-relative">
									<PerfectScrollbar>
										<div className="chat-contacts list-group">
											<ChatSideBarItem
												chats={this.state.chats}
												onClick={this.onClick}
												search={this.state.searchText}
											/>
											{/*<div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" tabIndex={0} style={{ left: "0px", width: "0px" }}></div></div>
											<div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" tabIndex={0} style={{ top: "0px", height: "0px" }}></div></div>*/}
										</div>
									</PerfectScrollbar>
								</div>

							</div>
							{this.state.currentChat ? <ChatBox
								chatId={this.state.currentChat.id}
							/> :
								<div className="d-flex col flex-column">

									<div className="flex-grow-0 py-3 pr-4 pl-lg-4">

										<div className="media align-items-center">
											<a href="" className="chat-sidebar d-lg-none d-block text-muted text-large px-4 mr-2">
												<i className="ion ion-md-more"></i>
											</a>

											<div className="position-relative">
											</div>
											<div className="media-body pl-3">
												{/*<span className="badge badge-dot badge-success indicator" style={{ marginTop: "5px" }}></span>*/}
												<strong style={{ paddingLeft: "5px" }}></strong>
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
												<div className="flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3 mr-3">
													No Chats Found...
												</div>
												{/*<div className="ps__rail-x" style={{ left: "0px", bottom: "0px" }}><div className="ps__thumb-x" style={{ left: "0px", width: "0px" }}></div></div>
								<div className="ps__rail-y" style={{ top: "0px", right: "0px" }}><div className="ps__thumb-y" style={{ top: "0px", height: "0px" }}></div></div>*/}
												<div id="messagesBottom"></div>
											</div>
										</PerfectScrollbar>
									</div>

									<hr className="border-light m-0" />
									<div className="flex-grow-0 py-3 px-4">
										<div className="input-group">
											<input type="text" disabled placeholder="Type your message" className="form-control chat-input" />
											<div className="input-group-append">
												<button type="button" className="btn btn-primary" >Send</button>
											</div>
										</div>
									</div>

								</div>}
						</div>

					</div>

				</div >

			</div >

		)
	}
}