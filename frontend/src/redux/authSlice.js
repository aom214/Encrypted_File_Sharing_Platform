import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const LOGIN_URL = "http://localhost:4000/api/v1/user/Login";
const GET_USER_URL = "http://localhost:4000/api/v1/user/GetUser";

// ✅ Async thunk for login (no localStorage)
export const loginUser = createAsyncThunk("auth/login", async ({ username, password }, thunkAPI) => {
  try {
    const response = await axios.post(LOGIN_URL, { username, password }, { 
      withCredentials: true // ✅ Ensure cookies are sent & received
    });

    return { user: response.data.user }; // ✅ No need to manually store JWT
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// ✅ Fetch user using cookies
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, thunkAPI) => {
  try {
    const response = await axios.get(GET_USER_URL, { 
      withCredentials: true // ✅ Ensure cookies are sent
    });

    return { user: response.data.user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "User fetch failed");
  }
});

const LOGOUT_URL = "http://localhost:4000/api/v1/user/Logout"; // ✅ Ensure correct URL

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await axios.post(LOGOUT_URL, {}, { 
      withCredentials: true // ✅ Ensure cookies are removed
    });
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
  }

  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => { // ✅ Used when fetching user
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
