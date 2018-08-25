import { ApiExecute } from "../common/apiExecute";

const baseUrl = "http://localhost:8080/"

const PostGUID = (model) => {
    return ApiExecute(`${baseUrl}api/forgotPassword`, "POST", model);
}

const PutPassword = (model) => {
    return ApiExecute(`${baseUrl}api/app/apptokens/${model.GUID}`, "PUT", model);
}

export const ForgotPasswordApi = {
    PostGUID,
    PutPassword
}