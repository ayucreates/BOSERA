import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  loading: false
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.userInfo.token}` }
    };
    const { data } = await axios.get('/api/users/profile', config);
    return data.wishlist;
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.userInfo.token}` }
    };
    const { data } = await axios.post(`/api/users/wishlist/${productId}`, {}, config);
    return data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, { getState }) => {
    const { auth } = getState();
    const config = {
      headers: { Authorization: `Bearer ${auth.userInfo.token}` }
    };
    const { data } = await axios.delete(`/api/users/wishlist/${productId}`, config);
    return data;
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
