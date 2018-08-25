import * as React from "react";
export const ChatSideBarItem = (props) => {
    const buildSideBar = (chat) => {
        if (props.search) {
            if (chat.users.some(user => user.firstName.toLowerCase().includes(props.search.toLowerCase()) || user.lastName.toLowerCase().includes(props.search.toLowerCase())))
                return (React.createElement("a", { key: chat.id, onClick: () => props.onClick(chat), className: "list-group-item list-group-item-action online", style: { display: "-webkit-inline-box" } },
                    React.createElement("img", { src: chat.users[0].avatarUrl, className: "d-block ui-w-40 rounded-circle", alt: "" }),
                    React.createElement("div", { className: "media-body ml-3" },
                        `${chat.users[0].firstName} ${chat.users[0].lastName}`,
                        React.createElement("div", { className: "chat-status small" },
                            React.createElement("span", { className: "badge badge-dot" }),
                            chat.newestMessage))));
            else
                return "";
        }
        else
            return (React.createElement("a", { key: chat.id, onClick: () => props.onClick(chat), className: "list-group-item list-group-item-action online", style: { display: "-webkit-inline-box" } },
                React.createElement("img", { src: chat.users[0].avatarUrl, className: "d-block ui-w-40 rounded-circle", alt: "" }),
                React.createElement("div", { className: "media-body ml-3" },
                    `${chat.users[0].firstName} ${chat.users[0].lastName}`,
                    React.createElement("div", { className: "chat-status small" },
                        React.createElement("span", { className: "badge badge-dot" }),
                        chat.newestMessage))));
    };
    return (React.createElement(React.Fragment, null, props.chats.map(buildSideBar)));
};
//# sourceMappingURL=ChatSideBarItem.js.map