import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authReducer";
import messageInfoReducer from "./messagesReducer";



const store = configureStore({
    reducer:{
        auth: authReducer,
        message: messageInfoReducer,
    }
})

export default store