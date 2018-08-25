import * as React from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    FlatList,
    View, TextInput
} from 'react-native';
import signalr from 'react-native-signalr';
import { ChatApi } from "./chatApi";
import { FormInput } from "react-native-elements";
import { Card, CardItem, Container, Header, Left, Title, Text, Body, Icon, Button, Right } from "native-base";
import { ChatMessage } from "./chatMessage";
import { textStyles, CustomText } from "../../utilities/theme/fonts";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    currentUser: state.auth.user
});

class ChatPage extends React.Component {
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
            chatId: this.props.navigation.state.params.chatId,
            chatUsersInfo: [],
            typing: "",
            room: "",
            chatConnection: {
                createHubProxy: () => { }
            }
        }
    }
    setupChat = () => {
        if (this.state.chatId) {
            //var connection = $.hubConnection();
            //var chatProxy = connection.createHubProxy("chatHub");
            const connection = signalr.hubConnection('http://localhost:3024');
            connection.logging = true;

            const chat = connection.createHubProxy('chatHub');
            chat.on("addMessage", (text, user, chatId, messageId) => {
                const messages = this.state.messages.slice(0);
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
                // console.log("Messages", messages)

                this.setState({ ...this.state, messages: messages, messageText: "" });
            });
            chat.on("setTyping", (typingString, id) => {
                if (id != this.state.currentUserInfo.id)
                    this.setState({ typing: typingString }, () => console.log("Typing:", this.state.typing));
            });
            ChatApi.getUserMessages(this.state.chatId, this.props.currentUser.Id)
                .then(res => {
                    if (res.item) {
                        // console.log("Messages: ", res.item);
                        let usersInfo = res.item.usersInfo;
                        let currentUser = res.item.currentUserInfo;
                        // {
                        //     _id: res.item.currentUserInfo.id,
                        //         name: `${res.item.currentUserInfo.firstName} ${res.item.currentUserInfo.lastName}`,
                        //             avatar: res.item.currentUserInfo.avatarUrl
                        // };
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
                            console.log("Chat mount", this.state)
                            connection.start().done(() => {
                                console.log('Now connected, connection ID=' + connection.id);
                                connection.proxies.chatHub = chat;
                                chat.invoke("joinRoom", groupName).done(() => console.log("Joined Room :", groupName))
                                this.setState({ ...this.state, chatConnection: chat })

                            }).fail(() => {
                                console.log('Failed');
                            });

                            //connection-handling
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
                    else throw new Error("No Chat Found")
                })
                .catch(err => console.log("Error:", err.message));
        }
    }
    onChange = (text) => {
        let nextState = {
            ...this.state,
            messageText: text

        };
        let typingString = "";
        // const connection = this.state.connection;
        // const chat = signalr.hubConnection;

        if (nextState.messageText.length == 1 && this.state.messageText.length == 0) {
            typingString = `${this.state.currentUserInfo.firstName} is Typing...`
            this.state.chatConnection.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
            // chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
        }
        else if (nextState.messageText.length == 0 && this.state.messageText.length == 1) {
            this.state.chatConnection.invoke("sendTyping", typingString, this.state.room, this.state.currentUserInfo.id);
            // chat.server.sendTyping(typingString, this.state.room, this.state.currentUserInfo.id);
        }
        this.setState(nextState, () => {
            console.log("MessageField: ", this.state.messageText);
        })

    }
    onSubmit = () => {
        ChatApi.addMessage({ SenderUserBaseId: this.state.currentUserInfo.id, ChatId: this.state.chatId, Message: this.state.messageText })
            .then(res => {
                //var page = $.connection.loginHub;
                this.state.chatConnection.invoke("send", this.state.messageText, this.state.currentUserInfo, this.state.chatId, 0, this.state.room);
                this.state.chatConnection.invoke("sendTyping", "", this.state.room, this.state.currentUserInfo.id);
                this.setState({ ...this.state, messageText: "" })
                //page.server.updateUnreadMessages(`chat${this.state.chatId}`, this.state.chatId);
            })
            .catch(err => console.log(err));
    }
    onKeyPress = evt => {
        if (evt.keyCode == 13)
            this.onSubmit();
    }
    componentDidMount() {
        this.setupChat();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <FlatList inverted
                    style={{ flex: 1 }}
                    data={[...this.state.messages].reverse()}
                    renderItem={item =>
                        <ChatMessage
                            currentUser={this.state.currentUserInfo}
                            key={item.index}
                            message={item}
                        />
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
                <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={25}>
                    <View style={{ flexDirection: "row" }}>
                        <TextInput
                            style={{ justifyContent: "space-between", flex: 1 }}
                            value={this.state.messageText}
                            textContentType="text"
                            placeholder="Type your message..."
                            onChangeText={(text) => this.onChange(text)}
                        />
                        <Button primary
                            onPress={() => this.onSubmit()}
                        >
                            <Text>Send</Text>
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export default connect(mapStateToProps)(ChatPage);

const styles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
