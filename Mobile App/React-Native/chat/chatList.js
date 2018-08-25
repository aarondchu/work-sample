import * as React from "react";
import { ScrollView } from "react-native"
import { List, ListItem } from "react-native-elements"
import { ChatApi } from "./chatApi";
import { textStyles } from "../../utilities/theme/fonts";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({
    currentUser: state.auth.user
});

class ChatList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            searchText: ""
        }
    }
    static navigationOptions = () => ({})
    componentDidMount() {
        ChatApi.getUserChats(this.props.currentUser.Id)
            .then(res => {
                if (res.items) {
                    this.setState({ ...this.state, chats: res.items }, () => {
                        //this.updateMessagesRead();
                        //this.setupPageHub();
                    });
                }
                else throw new Error("No Chats Found");
            })
            .catch(err => console.log("Error: ", err.message))
    }
    onClick = (chat) => {
        this.setState({ currentChat: chat }/*, () => this.updateMessagesRead()*/);
    }
    onChange = (search) => {
        this.setState({ searchText: search });
    }
    render() {
        return (
            <React.Fragment>
                <ScrollView>
                    <List>
                        {this.state.chats.map((chat, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    title={`${chat.users[0].firstName} ${chat.users[0].lastName}`}
                                    titleStyle={{ fontFamily: textStyles.paragraph.fontFamily }}
                                    avatar={chat.users[0].avatarUrl}
                                    onPress={() => this.props.navigation.push(`Messages`, { chatId: chat.id })}
                                    roundAvatar={true}
                                    subtitle={chat.newestMessage}
                                    subtitleStyle={{ fontFamily: textStyles.paragraph.fontFamily, fontWeight: '100' }}
                                />
                            )
                        }
                        )}
                    </List>
                </ScrollView>
            </React.Fragment>
        )
    }
}

export default connect(mapStateToProps)(ChatList);