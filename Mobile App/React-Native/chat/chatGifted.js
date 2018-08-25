import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { connect } from 'react-redux';
import signalr from 'react-native-signalr';
import { ChatApi } from "./chatApi";

const mapStateToProps = (state) => ({
    currentUser: state.auth.user
});

class ChatGift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: "",
            messages: [],
            chatUsersInfo: [],
            chatId: this.props.navigation.state.params.chatId,
            user: {
                _id: props.currentUser.Id,
                name: props.currentUser.FirstName + " " + props.currentUser.LastName,
                avatar: props.currentUser.AvatarUrl
            },
            chatConnection: {
                createHubProxy: () => { }
            }
        };
    }

    componentDidMount() {
        this.setupChat();
    }

    setupChat = () => {
        if (this.state.chatId) {
            const connection = signalr.hubConnection('http://localhost:3024');
            connection.logging = true;

            const chatProxy = connection.createHubProxy('chatHub');
            // receives broadcast messages
            chatProxy.on("addMessage", (text, user, chatId, messageId) => {
                console.log("message-from-server", text, user, chatId, messageId);

                const messages = this.state.messages.slice(0);
                messages.push({
                    _id: messageId,
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: user.Id,
                        name: user.FirstName,
                        avatar: user.AvatarUrl,
                    }
                });
            });

            // set messages state
            ChatApi.getUserMessages(this.state.chatId, this.props.currentUser.Id)
                .then(resp => {
                    if (resp.item) {
                        console.log("MESSAGES: ", resp.item);

                        let usersInfo = resp.item.usersInfo;
                        let messages = resp.item.messages.map((msg, idx) => {
                            let newMsg = {
                                _id: msg.id,
                                text: msg.message,
                                createdAt: msg.sentDate,
                                user: {
                                    _id: msg.senderUserBaseId,
                                    name: "",
                                    avatar: "",
                                }
                            };
                            if (msg.senderUserBaseId == this.props.currentUser.Id) {
                                newMsg.user.name = this.props.currentUser.FirstName;
                                newMsg.user.avatar = this.props.currentUser.AvatarUrl;
                            }
                            else {
                                let info = usersInfo.find(userInfo => userInfo.id == msg.senderUserBaseId);
                                newMsg.user.name = info.firstName;
                                newMsg.user.avatar = info.avatarUrl;
                            }
                            return newMsg;
                        });

                        let groupName = `chatBox${this.state.chatId}`;
                        this.setState({ ...this.state, messages: messages, chatUsersInfo: usersInfo, room: groupName }, () => {
                            console.log("CHAT MOUNT: ", this.state);
                            connection.start().done(() => {
                                console.log('Now connected, connection ID=' + connection.id);
                                connection.proxies.chatHub = chatProxy;
                                chatProxy.invoke("joinRoom", groupName).done(() => console.log("Joined Room :", groupName))
                                this.setState({ ...this.state, chatConnection: chatProxy })
                            }).fail(() => {
                                console.warn('Something went wrong when calling server, it might not be up and running?');
                            });

                            connection.connectionSlow(() => {
                                console.log('We are currently experiencing difficulties with the connection.')
                            });

                            connection.error((error) => {
                                const errorMessage = error.message;
                                let detailedError = '';
                                if (error.source && error.source._response) {
                                    detailedError = error.source._response;
                                }
                                if (detailedError === 'An SSL error has occurred and a secure connection to the server cannot be made.') {
                                    console.log('When using react-native-signalr on ios with http remember to enable http in App Transport Security https://github.com/olofd/react-native-signalr/issues/14')
                                }
                                console.debug('SignalR error: ' + errorMessage, detailedError)
                            });
                        });
                    }
                    else throw new Error("No chat found")
                })
                .catch(err => console.log("Error: ", err.message))
        }
    }

    onSendMessage = (messages = []) => {
        const prevMsgs = [...this.state.messages];
        ChatApi.addMessage({ SenderUserBaseId: this.props.currentUser.Id, ChatId: this.state.chatId, Message: messages })
            .then(resp => {
                this.setState({ messages: GiftedChat.append(prevMsgs, messages) }, () => {
                    console.log(this.state);
                    this.state.chatConnection.invoke("send", this.state.messageText, this.state.currentUserInfo, this.state.chatId, 0, this.state.room);
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <View style={styles.container}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSendMessage(messages)}
                    user={this.state.user}
                />
            </View>
        );
    }
}

export default connect(mapStateToProps)(ChatGift);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});