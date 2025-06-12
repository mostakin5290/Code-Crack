import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// --- Thunks (with improved error handling) ---

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/register', userData);
      return response.data.user;
    } catch (error) {
      // FIX: Pass only the serializable error message
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      // FIX: Pass only the serializable error message
      return rejectWithValue(error.response?.data?.message || 'Invalid credentials');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check');
      return data.user;
    } catch (error) {
      console.log(error)
      // No need to pass a message here, rejection is enough to signify "not authenticated"
      return rejectWithValue();
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (err) {
      // Pass a generic message
      console.log(err)
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);


// --- Slice Definition ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    // FIX: Start with loading: true to handle the initial app load `checkAuth` call.
    loading: true,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      // This will merge the new user data from the server with the existing user state.
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Case: Logout fulfilled - clears the session
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- Matchers for handling multiple actions at once (DRY principle) ---

      // These actions set isAuthenticated and user state upon success
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled, checkAuth.fulfilled),
        (state, action) => {
          state.isAuthenticated = !!action.payload; // true if user object exists, false if null
          state.user = action.payload;
        }
      )

      // These actions indicate loading state for user-initiated actions
      .addMatcher(
        isAnyOf(registerUser.pending, loginUser.pending, logoutUser.pending),
        (state) => {
          state.loading = true;
          state.error = null; // Clear previous errors
        }
      )

      // These actions handle all rejection cases
      .addMatcher(
        isAnyOf(registerUser.rejected, loginUser.rejected, logoutUser.rejected, checkAuth.rejected),
        (state, action) => {
          state.loading = false;
          state.isAuthenticated = false;
          state.user = null;
          // Use the specific message from rejectWithValue, or a default
          state.error = action.payload || 'An authentication error occurred.';
        }
      )

      // Finally, a matcher to turn off loading for any completed thunk.
      // This includes checkAuth, which shouldn't have a visible loading state.
      .addMatcher(
        isAnyOf(
          registerUser.fulfilled, loginUser.fulfilled, checkAuth.fulfilled, logoutUser.fulfilled,
          registerUser.rejected, loginUser.rejected, checkAuth.rejected, logoutUser.rejected
        ),
        (state) => {
          state.loading = false;
        }
      )
  }
});
export const { setUser } = authSlice.actions

export default authSlice.reducer;