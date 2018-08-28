import * as React from "react"
import { KeyboardAvoidingView, AsyncStorage, StyleSheet, ImageBackground, Image, View, Animated, Keyboard } from "react-native"
import { Button, Badge, Text } from "react-native-elements"
import { FormInput, FormLabel, FormValidationMessage } from "react-native-elements";
import { validateFields, formatTestCase } from "../common/dynamicRuleValidation"
import { LoginApi } from "./loginApi";
import Expo from "expo";
import { LoginForm } from "./loginForm";
import axios from "axios";
import { Item } from "native-base";

import { authenticateLogin } from '../../actions/auth';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	authenticating: state.auth.isAuthenticating
});

const mapDispatchToProps = (dispatch) => ({
	dispatchAuthLogin: (data) => { dispatch(authenticateLogin(data)) }
});

class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			login: {
				email: "",
				password: ""
			},
			error: {
				email: "",
				password: ""
			},
			isFormValid: false,
			errorMessage: "",
			loggingIn: false,
			paddingInput: new Animated.Value(130)
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

	static navigationOptions = () => ({})

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
				case "password":
					rules = {
						validPassword: true
					}
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
		this.setState({ ...this.state, isFormValid: tests.every(test => test.errMsg.length == 0), error: newErrMsgs })
	}

	onLogin = () => {
		this.props.dispatchAuthLogin(this.state.login); // dispatch to login action
		setTimeout(() => this.props.navigation.navigate('Main'), 2000);
	}

	onChange = (fieldName, fieldValue) => {
		this.setState({ ...this.state, login: { ...this.state.login, [fieldName]: fieldValue } }, () => this.validateFields(this.state.login, fieldName))
	}

	navigateToForgotPw = () => this.props.navigation.push("ForgotPassword");
	navigateToRegister = () => this.props.navigation.navigate("Register");

	render() {
		return (
			<React.Fragment>
				<ImageBackground source={require("../../assets/images/bg_screen1.jpg")} style={styles.backgroundImage} >
					<KeyboardAvoidingView behavior="padding" enabled>
						<Image source={require("../../assets/logo/header.png")} style={styles.logo} resizeMode="contain" />
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
							<LoginForm
								login={this.state.login}
								error={this.state.error}
								onLogin={this.onLogin}
								isFormValid={this.state.isFormValid}
								onChange={this.onChange}
								navigateToForgotPw={this.navigateToForgotPw}
								navigateToRegister={this.navigateToRegister}
								loggingIn={this.state.loggingIn}
								{...this.props}
							/>
						</Animated.View>
					</KeyboardAvoidingView>
				</ImageBackground>
			</React.Fragment >
		)
	}

}
let styles = StyleSheet.create({
	backgroundImage: {
		width: "100%",
		height: "100%" // or 'stretch'
	},
	// form: {
	// 	marginTop: "80%",
	// 	height: "100%",
	// 	marginBottom: this.state.paddingInput,
	// 	justifyContent: "center",
	// },
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
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);