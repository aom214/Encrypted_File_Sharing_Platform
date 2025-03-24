import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js"; 
import registerReducer from "./registerSlice.js"; // ✅ Import register slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer, // ✅ Add register reducer
  },
});

export default store;
