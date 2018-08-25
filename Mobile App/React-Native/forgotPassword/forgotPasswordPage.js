import * as React from "react";
import { ForgotPasswordForm } from "./forgotPasswordForm";
import { KeyboardAvoidingView, StyleSheet, ImageBackground, Image, View, Animated, Keyboard } from "react-native"
import { validateFields, formatTestCase } from "../common/dynamicRuleValidation"
import { ForgotPasswordApi } from "./forgotPasswordApi";
import { Card, Text, Badge } from "../../node_modules/react-native-elements";
import { textStyles, CustomText } from "../../utilities/theme/index";


export default class ForgotPasswordPage extends React.Component {
    constructor() {
        super();
        this.state = {
            forgot: {
                email: ""
            },
            regEmailMsg: "",
            GUID: "",
            error: {
                email: ""
            },
            isLoading: false,
            paddingInput: new Animated.Value(130),
            isFormValid: false
        }
    }
    componentWillMount() {
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }

    componentWillUnmount() {
        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {
        Animated.timing(this.state.paddingInput, {
            duration: event.duration,
            toValue: 80,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.state.paddingInput, {
            duration: event.duration,
            toValue: 130,
        }).start();
    };
    onChange = (fieldName, fieldValue) => {
        let nextState = {
            ...this.state, forgot: {
                email: fieldValue
            }
        }
        this.setState(nextState, () => {
            this.validateFields(this.state.forgot, fieldName); //validate password
        });
    }

    // On submit of email address:
    onSubmit = () => {
        this.setState({ isLoading: true }, () => {
            ForgotPasswordApi.PostGUID(this.state.forgot) //get GUID token
                .then((res) => {
                    if (res.item) {
                        this.setState({
                            ...this.state,
                            GUID: res.item,
                            isLoading: false
                        })

                        if (res.item == 0) { //DB returns "0" if no registered email found in the DB
                            this.setState({
                                ...this.state,
                                regEmailMsg: "No registered account was found with that email."
                            })
                        }
                        else {
                            this.setState({
                                ...this.state,
                                regEmailMsg: `Reset password link was sent to ${this.state.forgot.email}`
                            })
                        }
                    }
                    else this.setState({ ...this.state, regEmailMsg: "Unable to access Server", isLoading: false })
                })
                .catch(err => console.log("ERROR:", err));
        })
    }

    //Validate Field function
    validateFields = (form, fieldName) => {
        let tests = new Array();
        for (let field in form) {
            let rules = {};
            switch (field) {
                case "email":
                    rules = {
                        minLength: 3,
                        maxLength: 50,
                        validEmail: true
                    }
                    break;
                default:
                    break;
            }
            tests.push(formatTestCase(form[field], field, rules, new Array()))
        }
        tests = validateFields(tests);

        let newErrMsgs = { ...this.state.error };
        let currentFieldTest = tests.find(test => test.field == fieldName);
        if (currentFieldTest.errMsg.length > 0 && currentFieldTest.value)
            newErrMsgs = { ...this.state.error, [fieldName]: currentFieldTest.errMsg[0] };
        else newErrMsgs = { ...this.state.error, [fieldName]: "" }
        this.setState({
            ...this.state, isFormValid: tests.every(test => test.errMsg.length == 0), error: newErrMsgs

        }, () => console.log(this.state))
    }
    render() {
        return (
            <React.Fragment>
                <ImageBackground source={require("../../assets/images/bg_screen1.jpg")} style={styles.backgroundImage} >
                    <KeyboardAvoidingView behavior="padding" enabled>
                        <Image source={require("../../assets/logo/eleveight-header.png")} style={styles.logo} resizeMode="contain" />
                        <Animated.View style={{
                            marginTop: this.state.paddingInput,
                            height: "100%",
                            marginBottom: "20%",
                            justifyContent: "center",
                        }}>
                            {this.state.errorMessage ?
                                <Badge
                                    containerStyle={{ backgroundColor: "#ff7575" }}>
                                    <Text>{`${this.state.errorMessage}`}</Text>
                                </Badge> : <React.Fragment></React.Fragment>
                            }
                            {this.state.regEmailMsg ?
                                <Badge>
                                    <Text>{`${this.state.regEmailMsg}`}</Text>
                                </Badge> : <React.Fragment></React.Fragment>}
                            <ForgotPasswordForm
                                isLoading={this.state.isLoading}
                                forgot={this.state.forgot}
                                error={this.state.error}
                                onSubmit={this.onSubmit}
                                isFormValid={this.state.isFormValid}
                                onChange={this.onChange}
                                {...this.props}
                            />
                        </Animated.View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </React.Fragment>
        );
    }
}
let styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%" // or 'stretch'
    },
    form: {
        marginTop: "100%",
        height: "100%",
        marginBottom: "20%",
        justifyContent: "center",
    },
    logo: {
        marginTop: "20%",
        // marginBottom: "50%",
        // paddingTop: "30%",
        width: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center"
    }
});	