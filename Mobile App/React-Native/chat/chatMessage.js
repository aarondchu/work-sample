import * as React from "react";
import { Card, CardItem, Text, Body } from "native-base"
import { textStyles, CustomText } from "../../utilities/theme/fonts";

const getTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatMessage = (props) => {
    return (
        <Card transparent>
            <CardItem header>
                <CustomText fontStyle={textStyles.paragraph} style={{ color: '#A9A9A9' }}>{props.message.item.senderFirstName}</CustomText>
            </CardItem>
            <CardItem>
                <Body>
                    <CustomText fontStyle={textStyles.paragraph}>
                        {props.message.item.message}
                    </CustomText>
                </Body>
            </CardItem>
        </Card>
    )
}
