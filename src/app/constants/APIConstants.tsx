export const API_BASE_URL = "https://e-charter-test.onrender.com/api/";

export const API = {
    USER_LOGIN: API_BASE_URL+"user/login",
    USER_SIGNUP: API_BASE_URL+"user/register",
    USER_FORGOT_PASSWORD: API_BASE_URL+"user/requestreset",
    VERIFY_RESET_CODE: API_BASE_URL+"user/verifyresetcode",
    USER_RESET_PASSWORD: API_BASE_URL+"user/resetpassword",
    USER_PROFILE: API_BASE_URL+"user/getuserprofile",
    CARS_FOR_RESERVE: API_BASE_URL+"trip/recommend",

}