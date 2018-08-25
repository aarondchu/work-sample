import * as React from "react";
import { FormInput, FormLabel, Button, FormValidationMessage } from "react-native-elements";
import { ScrollView, KeyboardAvoidView, View, StyleSheet, Text } from "react-native"
import { Input } from "../common/form/index";
import { Dropdown } from "../common/form/dropdown";
import { colors } from '../../utilities/theme/index';
import { DeckSwiper, Icon } from "native-base";
import Swiper from 'react-native-swiper';
import { textStyles } from '../../utilities/theme/fonts';

export const RegisterForm = (props) => {
    return (
        <React.Fragment>
            <Swiper
                loop={false}
                dotColor="white"
                activeDotColor={colors.primary1}
            >
                <React.Fragment>
                    <Input
                        label="Email"
                        name="email"
                        value={props.register.email}
                        placeholder="Please enter your email"
                        error={props.error}
                        onChange={props.onChange}
                        type="email"
                        capital="none"
                        inputStyle={textStyles.paragraph}
                    />
                    <Input
                        label="Password"
                        name="passwordHash"
                        value={props.register.passwordHash}
                        placeholder="Please enter your password"
                        error={props.error}
                        onChange={props.onChange}
                        type="password"
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmpassword"
                        value={props.register.confirmpassword}
                        placeholder="Please confirm your password"
                        error={props.error}
                        onChange={props.onChange}
                        type="password"
                    />
                </React.Fragment>
                <React.Fragment>
                    <Input
                        label="First Name"
                        name="firstname"
                        value={props.register.firstname}
                        placeholder="Please enter your First Name"
                        error={props.error}
                        onChange={props.onChange}
                        type="text"
                    />
                    <Input
                        label="Middle Name"
                        name="middlename"
                        value={props.register.middlename}
                        placeholder="Please enter your Middle Name"
                        error={props.error}
                        onChange={props.onChange}
                        type="text"
                    />
                    <Input
                        label="Last Name"
                        name="lastname"
                        value={props.register.lastname}
                        placeholder="Please enter your Last Name"
                        error={props.error}
                        onChange={props.onChange}
                        type="text"
                    />
                </React.Fragment>
                <React.Fragment>
                    <Dropdown
                        label="Gender"
                        value={props.register.gender}
                        options={props.genderOptions}
                        error={props.error}
                        name="gender"
                        onChange={props.onChange}
                    />
                    <Input
                        label="Zip Code"
                        name="zipcode"
                        value={props.register.zipcode}
                        placeholder="Please enter your zip code"
                        error={props.error}
                        onChange={props.onChange}
                        type="number"
                    />
                    <Input
                        label="Phone Number"
                        name="phonenumber"
                        value={props.register.phonenumber}
                        placeholder="Please enter your Phone Number"
                        error={props.error}
                        onChange={props.onChange}
                        type="number"
                    />
                    <Button
                        rounded={true}
                        type="button"
                        title="Register"
                        onPress={props.onRegister}
                        disabled={!props.isFormValid}
                        backgroundColor={colors.primary2}
                    />
                </React.Fragment>
            </Swiper>
            {/* <Button onPress={() => this._deckSwiper._root.swipeLeft()}>
                <Icon name="arrow-back" />
                <Text>Previous</Text>
            </Button>
            <Button onPress={() => this._deckSwiper._root.swipeRight()}>
                <Icon name="arrow-forward" />
                <Text>Next</Text>
            </Button>
            <Button
                type="button"
                title="Login as Existing User"
                onPress={props.navigateToLogin}
                backgroundColor={colors.grey2}
            /> */}
        </React.Fragment >
    )
}