import * as React from "react";
import { Card } from "../common/card";
import { IMessageContent, IChatUserInfo } from "./ChatBox";

interface IMessageProps {
	message: IMessageContent,
	currentUserInfo: IChatUserInfo,
	idx: number
}
const getTime = (date: Date) => {
	return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const Message = (props: IMessageProps) => {
	return (
		<div className="chat-message mb-4 clearfix  text-truncate" id={`chat-messages${props.idx}`}>
			<div className={props.currentUserInfo.id == props.message.senderUserBaseId ? "float-right" : "float-left"}>
				<div className={props.currentUserInfo.id == props.message.senderUserBaseId ? "d-flex flex-row-reverse" : "d-flex flex-row"}>
					<div>
						<img src={props.message.picture} className="ui-w-40 rounded-circle" alt="" />
						<div className="text-muted small text-nowrap mt-2">{`${getTime(props.message.sentDate)}`}</div>
					</div>
					<div className="flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3 mr-3">
						<div className="font-weight-semibold mb-1">{props.message.senderUserBaseId == props.currentUserInfo.id ? "You" : props.message.senderFirstName}</div>
						{props.message.message}
					</div>
				</div>
			</div>
		</div>
	)
}