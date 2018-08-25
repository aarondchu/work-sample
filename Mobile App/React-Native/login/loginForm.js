import * as React from "react";
import { Button } from "react-native-elements";
import { Input } from "../common/form";
import { colors } from "../../utilities/theme/index";
import { textStyles, CustomText } from "../../utilities/theme/fonts";


export const LoginForm = (props) => {
    return (
        <React.Fragment>
            <Input
                label="Email"
                name="email"
                value={props.login.email}
                placeholder="Please enter your email"
                error={props.error}
                onChange={props.onChange}
                type="email"
                capital="none"
            />
            <Input
                label="Password"
                name="password"
                value={props.login.password}
                placeholder="Please enter your password"
                error={props.error}
                onChange={props.onChange}
                type="password"
            />
            <Button
                type="button"
                title={props.loggingIn ? "" : "Login"}
                rounded={true}
                loading={props.loggingIn}
                onPress={props.onLogin}
                disabled={!props.isFormValid}
                backgroundColor={colors.primary2}
                loading={props.authenticating}
                fontFamily={textStyles.buttonText.fontFamily}
            />
            <Button
                type="button"
                title="Register a New User"
                rounded={true}
                onPress={props.navigateToRegister}
                backgroundColor={colors.grey2}
                fontFamily={textStyles.buttonText.fontFamily}
            />
            <CustomText
                style={{ textAlign: "center", color: "white", marginTop: "5%" }}
                onPress={props.navigateToForgotPw}
                fontStyle={textStyles.paragraph}
            >
                Forgot Password
            </CustomText>
        </React.Fragment >
    )
}