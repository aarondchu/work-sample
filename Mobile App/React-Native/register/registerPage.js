import * as React from "react";
import { RegisterForm } from "./registerForm";
import { validateFields, formatTestCase } from "../common/dynamicRuleValidation"
import { KeyboardAvoidingView, StyleSheet, Image, ImageBackground, View, Animated, Keyboard } from "react-native";
import { ApiExecute } from "../common/apiExecute"
import { Badge } from "react-native-elements"

export default class RegisterPage extends React.Component {

    constructor() {
        super();
        this.state = {
            register: {
                email: "",
                passwordHash: "",
                confirmpassword: "",
                firstname: "",
                middlename: "",
                lastname: "",
                gender: "",
                phonenumber: "",
                zipcode: "",
                signuptype: "Student"
            },
            error: {
                email: "",
                passwordHash: "",
                confirmpassword: "",
                firstname: "",
                middlename: "",
                lastname: "",
                gender: "",
                phonenumber: "",
                zipcode: ""
            },
            regEmailMsg: "",
            isFormValid: false,
            dropdownGender: [{ value: "", text: "Please select your gender" }, { value: "Male", text: "Male" }, { value: "Female", text: "Female" }]
        }
    }

    static navigationOptions = () => ({})

    onChange = (fieldName, fieldValue) => {
        this.setState({ ...this.state, register: { ...this.state.register, [fieldName]: fieldValue } }, () => this.validateFields(this.state.register, fieldName))
    }

    validateFields = (form, fieldName) => {
        if (this.state.error[fieldName] != undefined) {
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
                    case "confirmpassword":
                    case "passwordHash":
                        rules = {
                            validPassword: true
                        }
                        break;
                    case "firstname":
                        rules = {
                            minLength: 3,
                            maxLength: 50,
                        }
                        break;
                    case "middlename":
                        rules = {
                            maxLength: 50,
                        }
                        break;
                    case "lastname":
                        rules = {
                            minLength: 3,
                            maxLength: 50,
                        }
                        break;
                    case "phonenumber":
                        rules = {
                            minLength: 10,
                            maxLength: 10,
                            isNumber: true,
                        }
                        break;
                    case "zipcode":
                        rules = {
                            minLength: 5,
                            maxLength: 5,
                            isNumber: true,
                        }
                        break;
                    case "gender":
                    case "signuptype":
                        rules = {
                            validDropDown: true,
                        }
                    default:
                        break;
                }
                tests.push(formatTestCase(form[field], field, rules, new Array()));
            }
            tests = validateFields(tests);
            let newErrMsgs = { ...this.state.error };
            let currentFieldTest = tests.find(test => test.field == fieldName);
            if (currentFieldTest.errMsg.length > 0 && currentFieldTest.value)
                newErrMsgs = { ...this.state.error, [fieldName]: currentFieldTest.errMsg[0] };
            else newErrMsgs = { ...this.state.error, [fieldName]: "" }
            this.setState({ ...this.state, isFormValid: tests.every(test => test.errMsg.length == 0) && this.state.register.passwordHash == this.state.register.confirmpassword, error: newErrMsgs })
        }
    }

    clickSubmit = () => {

        ApiExecute("http://localhost:8080/api/register", "POST", this.state.register)
            .then(res => {
                this.setState({ regEmailMsg: `A confirmation email has been sent to ${this.state.register.email}. Please confirm your email before logging in.` }, () =>
                    setTimeout(() => this.props.navigation.navigate('Login'), 1000));
            })
            .catch(err => console.log("Failed", err.message));
    }

    navigateToLogin = () => this.props.navigation.navigate("SignIn");

    render() {
        return (
            <ImageBackground source={require("../../assets/images/bg_screen1.jpg")} style={styles.backgroundImage} >
                <KeyboardAvoidingView behavior="padding" enabled>
                    <Image source={require("../../assets/logo/header.png")} style={styles.logo} resizeMode="contain" />
                    <View style={styles.form}>
                        {this.state.errorMessage ?
                            <Badge
                                containerStyle={{ backgroundColor: "#ff7575" }}>
                                <Text>{`${this.state.errorMessage}`}</Text>
                            </Badge> : <React.Fragment></React.Fragment>
                        }
                        {this.state.regEmailMsg ?
                            <Badge >
                                <Text>{this.state.regEmailMsg}</Text>
                            </Badge> :
                            <RegisterForm
                                register={this.state.register}
                                error={this.state.error}
                                onChange={this.onChange}
                                onRegister={this.clickSubmit}
                                isFormValid={this.state.isFormValid}
                                genderOptions={this.state.dropdownGender}
                                navigateToLogin={this.navigateToLogin}
                                {...this.props}
                            />
                        }
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        )
    }
}
let styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%" // or 'stretch'
    },
    form: {
        marginTop: "50%",
        height: "85%",
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