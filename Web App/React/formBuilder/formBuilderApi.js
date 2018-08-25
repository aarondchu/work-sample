import ApiExecute from '../common/apiExecute';
const baseUrl = "";
const postForm = (data) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder`, "POST", data);
};
const getForm = (id) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder/${id}`, "GET", null);
};
const submitFormResults = (data) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder/${data.UserBaseId}`, "POST", data);
};
const getAllFormResultsForScholarship = (id) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder/results/${id}`, "GET", null);
};
const viewAllScholarshipsByUserId = (id) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder/showScholarships/${id}`, "GET", null);
};
const getFormResultForUser = (id, userId) => {
    return ApiExecute(`${baseUrl}/api/utilities/formbuilder/${id}/${userId}`, "GET", null);
};
const getFormUserInfo = (data) => {
    return ApiExecute(`${baseUrl}/api/utilities/userInfo`, "POST", data);
};
export const FormBuilderApi = {
    postForm,
    getForm,
    submitFormResults,
    getAllFormResultsForScholarship,
    getFormResultForUser,
    viewAllScholarshipsByUserId,
    getFormUserInfo
};
//# sourceMappingURL=formBuilderApi.js.map