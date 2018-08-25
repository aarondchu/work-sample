import * as React from "react";
import { IChatGroup } from "./ChatPage";
interface IChatSideBarItemProps {
	chats: IChatGroup[],
	onClick: (chat: any) => void,
	search: string
}

export const ChatSideBarItem = (props: IChatSideBarItemProps) => {
	const buildSideBar = (chat) => {
		if (props.search) {
			if (chat.users.some(user => user.firstName.toLowerCase().includes(props.search.toLowerCase()) || user.lastName.toLowerCase().includes(props.search.toLowerCase())))
				return (
					<a key={chat.id} onClick={() => props.onClick(chat)} className="list-group-item list-group-item-action online" style={{ display: "-webkit-inline-box" }}>
						<img src={chat.users[0].avatarUrl} className="d-block ui-w-40 rounded-circle" alt="" />
						<div className="media-body ml-3">
							{`${chat.users[0].firstName} ${chat.users[0].lastName}`}
							<div className="chat-status small">
								<span className="badge badge-dot"></span>{chat.newestMessage}
							</div>
						</div>
						{/*chat.unread > 0 ? <div className="badge badge-outline-success" style={{ marginTop: "50%" }}>{chat.unread}</div> : ""*/}
					</a>
				)
			else return ""
		}
		else return (
			<a key={chat.id} onClick={() => props.onClick(chat)} className="list-group-item list-group-item-action online" style={{ display: "-webkit-inline-box" }}>
				<img src={chat.users[0].avatarUrl} className="d-block ui-w-40 rounded-circle" alt="" />
				<div className="media-body ml-3">
					{`${chat.users[0].firstName} ${chat.users[0].lastName}`}
					<div className="chat-status small">
						<span className="badge badge-dot"></span>{chat.newestMessage}
					</div>
				</div>
				{/*chat.unread > 0 ? <div className="badge badge-outline-success" style={{ marginTop: "50%" }}>{chat.unread}</div> : ""*/}
			</a>
		)
	}
	return (
		<React.Fragment>
			{props.chats.map(buildSideBar)}
		</React.Fragment>
	)
}