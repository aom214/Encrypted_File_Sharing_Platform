import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const LOGIN_URL = "https://cybersecuritybackend.onrender.com/api/v1/user/Login";
const GET_USER_URL = "https://cybersecuritybackend.onrender.com/api/v1/user/GetUser";
const LOGOUT_URL = "https://cybersecuritybackend.onrender.com/api/v1/user/Logout";

// ✅ Async thunk for login (Cookies-based Auth)
export const loginUser = createAsyncThunk("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    const response = await axios.post(LOGIN_URL, { username, password }, { 
      withCredentials: true // ✅ Ensures cookies are sent & received
    });

    return { user: response.data.user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// ✅ Fetch user (Uses cookies)
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get(GET_USER_URL, { 
      withCredentials: true // ✅ Ensures cookies are sent
    });

    return { user: response.data.user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "User fetch failed");
  }
});

// ✅ Logout (Clears cookies)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post(LOGOUT_URL, {}, { 
      withCredentials: true // ✅ Ensures cookies are removed
    });
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }

  return null;
});

// ✅ Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => { 
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;





