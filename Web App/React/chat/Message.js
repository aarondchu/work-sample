import * as React from "react";
const getTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
export const Message = (props) => {
    return (React.createElement("div", { className: "chat-message mb-4 clearfix  text-truncate", id: `chat-messages${props.idx}` },
        React.createElement("div", { className: props.currentUserInfo.id == props.message.senderUserBaseId ? "float-right" : "float-left" },
            React.createElement("div", { className: props.currentUserInfo.id == props.message.senderUserBaseId ? "d-flex flex-row-reverse" : "d-flex flex-row" },
                React.createElement("div", null,
                    React.createElement("img", { src: props.message.picture, className: "ui-w-40 rounded-circle", alt: "" }),
                    React.createElement("div", { className: "text-muted small text-nowrap mt-2" }, `${getTime(props.message.sentDate)}`)),
                React.createElement("div", { className: "flex-shrink-1 bg-lighter rounded py-2 px-3 ml-3 mr-3" },
                    React.createElement("div", { className: "font-weight-semibold mb-1" }, props.message.senderUserBaseId == props.currentUserInfo.id ? "You" : props.message.senderFirstName),
                    props.message.message)))));
};
//# sourceMappingURL=Message.js.map