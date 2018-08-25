import * as React from "react";
import { StyleSheet, Text, View, ImageBackground, Dimensions, Image } from 'react-native';
import { Button, FormInput } from 'react-native-elements';
import { Font } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';

import { LoginApi } from './loginApi';
// import { Input } from '../common/form/input';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const APP_HEADER = require('../../assets/logo/eleveight-header.png');
const APP_ICON = require('../../assets/logo/eleveight-icon.png');
const BG_IMAGE = require('../../assets/images/pastel-blue-gradient.png');
// const BG_IMAGE = require('../../assets/images/bg_screen1.png');

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            showLoading: false,
            login: {
                email: "",
                password: ""
            },
            error: {
                email: "",
                password: ""
            },
            isFormValid: false
        };
    }

    async componentDidMount() {
        await Font.loadAsync({
            'georgia': require('../../assets/fonts/Georgia.ttf'),
            'regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
            'light': require('../../assets/fonts/Montserrat-Light.ttf'),
            'bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

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
            tests.push(formatTestCase(form[field], field, rules, new Array()));
        }
        tests = validateFields(tests);
        console.log(tests)
        let newErrMsgs = { ...this.state.error };
        let currentFieldTest = tests.find(test => test.field == fieldName);
        if (currentFieldTest.errMsg.length > 0 && currentFieldTest.value)
            newErrMsgs = { ...this.state.error, [fieldName]: currentFieldTest.errMsg[0] };
        else newErrMsgs = { ...this.state.error, [fieldName]: "" }
        this.setState({ ...this.state, isFormValid: tests.every(test => test.errMsg.length == 0), error: newErrMsgs })
    }

    onLogin = () => {
        LoginApi.login(this.state.login)
            .then(res => console.log("Success:", res))
            .catch(err => console.log("Error:", err))
    }

    // TODO emily: handle isAccountLocked

    onChange = (fieldName, fieldValue) => {
        this.setState({ ...this.state, login: { ...this.state.login, [fieldName]: fieldValue } }, () => this.validateFields(this.state.login, fieldName))
    }

    // validateEmail(email) {
    //     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //     return re.test(email);
    // }

    // submitLoginCredentials() {
    //     const { showLoading } = this.state;

    //     this.setState({
    //         showLoading: !showLoading
    //     });
    // }

    render() {
        const { email, password, email_valid, showLoading } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground
                    source={BG_IMAGE}
                    style={styles.bgImage}
                >
                    {this.state.fontLoaded ?
                        <View style={styles.loginView}>
                            <View style={styles.loginTitle}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: 70, height: 70 }}
                                        source={APP_ICON}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.titleText}>eleveight</Text>
                                </View>
                            </View>
                            <View style={styles.loginInput}>
                                <FormInput
                                    leftIcon={
                                        <Icon
                                            name='user-o'
                                            color='rgba(171, 189, 219, 1)'
                                            size={25}
                                        />
                                    }
                                    containerStyle={{ marginVertical: 10 }}
                                    onChangeText={(text) => this.onChange("email", text)}
                                    value={this.state.login.email}
                                    inputStyle={{ marginLeft: 10, color: 'white' }}
                                    keyboardAppearance="light"
                                    placeholder="Email"
                                    autoFocus={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    // ref={input => this.emailInput = input}
                                    // onSubmitEditing={() => { // callback when text input submit button pressed *note: invalid if multiline={true}
                                    //     this.setState({ email_valid: this.validateEmail(email) });
                                    //     this.passwordInput.focus();
                                    // }}
                                    blurOnSubmit={false}
                                    placeholderTextColor="white"
                                    errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                    errorMessage={this.state.error.email}
                                />
                                <FormInput
                                    leftIcon={
                                        <Icon
                                            name='lock'
                                            color='rgba(171, 189, 219, 1)'
                                            size={25}
                                        />
                                    }
                                    containerStyle={{ marginVertical: 10 }}
                                    onChangeText={(text) => this.onChange("password", text)}
                                    value={password}
                                    inputStyle={{ marginLeft: 10, color: 'white' }}
                                    secureTextEntry={true}
                                    keyboardAppearance="light"
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    // ref={input => this.passwordInput = input}
                                    blurOnSubmit={true}
                                    placeholderTextColor="white"
                                />
                            </View>
                            <Button
                                title='LOG IN'
                                activeOpacity={1}
                                underlayColor="transparent"
                                onPress={this.onLogin}
                                loading={showLoading}
                                loadingProps={{ size: 'small', color: 'white' }}
                                disabled={this.state.isFormValid}
                                buttonStyle={{ height: 50, width: 250, backgroundColor: 'transparent', borderWidth: 2, borderColor: 'white', borderRadius: 30 }}
                                containerStyle={{ marginVertical: 10 }}
                                titleStyle={{ fontWeight: 'bold', color: 'white' }}
                            />
                            <View style={styles.footerView}>
                                <Text style={{ color: 'grey' }}>
                                    Forgot password?
                                </Text>
                                <Button
                                    title=""
                                    clear
                                    activeOpacity={0.5}
                                    titleStyle={{ color: 'white', fontSize: 15 }}
                                    containerStyle={{ marginTop: -10 }}
                                    onPress={() => console.log('Redirect me to register!!')}
                                />
                                <Text style={{ color: 'grey' }}>
                                    New here?
                                </Text>
                                <Button
                                    title="Create an Account"
                                    clear
                                    activeOpacity={0.5}
                                    titleStyle={{ color: 'white', fontSize: 15 }}
                                    containerStyle={{ marginTop: -10 }}
                                    onPress={() => console.log('Redirect me to register!!')}
                                />
                            </View>
                        </View> :
                        <Text>Loading...</Text>
                    }
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginView: {
        marginTop: 0,
        backgroundColor: 'transparent',
        width: 250,
        height: 400,
    },
    loginTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontSize: 45,
        fontFamily: 'quicksand'
    },
    loginInput: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerView: {
        marginTop: 20,
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

