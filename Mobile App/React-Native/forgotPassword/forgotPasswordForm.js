import * as React from "react";
import { Button } from "react-native-elements";
import { Input } from "../common/form/index";
import { colors, textStyles } from "../../utilities/theme/index";

export const ForgotPasswordForm = props => {
    return (
        <React.Fragment>
            <Input
                label="Email"
                name="email"
                value={props.forgot.email}
                placeholder="Please enter your email"
                error={props.error}
                onChange={props.onChange}
                type="email"
                capital="none"
            />
            <Button
                loading={props.isLoading}
                type="button"
                rounded={true}
                title={props.isLoading ? "" : "Send password reset email"}
                onPress={props.onSubmit}
                backgroundColor={colors.primary2}
                fontFamily={textStyles.buttonText.fontFamily}
            />
        </React.Fragment>
    )
}