import * as React from "react";
import { ApiExecute } from "../common/apiExecute";

const login = (data) => {
    return ApiExecute("http://localhost:8080/api/login", "POST", data);
}

const getUserInfo = () => {
    return ApiExecute("http://localhost:8080/api/login/info", "GET", null);
}

export const LoginApi = {
    login,
    getUserInfo
} 