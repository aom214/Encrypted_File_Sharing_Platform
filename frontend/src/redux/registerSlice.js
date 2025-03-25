import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cybersecurityproject-soi5.onrender.com/api/v1/user/Register"; // ✅ API Endpoint

// 🔹 Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const formData = new FormData();

      // ✅ Append all fields correctly (especially `profile_photo`)
      Object.keys(userData).forEach((key) => {
        if (key === "profilePhoto") {
          formData.append("profile_photo", userData[key]); // ✅ Rename `profilePhoto` → `profile_photo`
        } else {
          formData.append(key, userData[key]);
        }
      });

      // ✅ Debugging: Check if the file is sent correctly
      console.log("Sending file:", userData.profilePhoto);

      // ✅ POST Request to Register API
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data; // ✅ Return user data after registration
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || "Registration failed");
    }
  }
);

// 🔹 Registration slice
const registerSlice = createSlice({
  name: "register",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {}, // No reducers needed since registration is only one-time
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default registerSlice.reducer;
