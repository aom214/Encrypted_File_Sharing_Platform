import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/login',
        { username, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.log("Login API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: 'Login failed' });
    }
  }
);

// Async thunk for OTP verification
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ username, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/${username}/Verify_Otp`,
        { otp },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.log("Verify OTP API error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      return rejectWithValue(err.response?.data || { message: 'OTP verification failed' });
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/api/v1/user/logout',
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.log("Logout API error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: 'Logout failed' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    username: null,
    loading: false,
    error: null,
    otpRequired: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.otpRequired = false;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.otpRequired || action.payload.message?.toLowerCase().includes("otp")) {
          state.otpRequired = true;
        } else {
          state.user = action.payload.user;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle OTP verification
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.otpRequired = false;
        state.username = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Handle logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.username = null;
        state.otpRequired = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { setUser, setUsername } = authSlice.actions;
export default authSlice.reducer;
