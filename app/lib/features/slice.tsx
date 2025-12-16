import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type MenuItem = {
  id: number;
  name: string;
  category: { id: number; name: string };
  addOnTypes: { id: number; name: string }[];
};

interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
};

// Thunk to fetch from API
export const fetchMenu = createAsyncThunk("menu/fetchMenu", async () => {
  const res = await fetch("/api/menu");
  console.log(res, "res of fetchMenuTrial");
  if (!res.ok) throw new Error("Failed to fetch menu");
  return (await res.json()) as MenuItem[];
});

const menuSlice = createSlice({
  name: "trial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMenu.fulfilled,
        (state, action: PayloadAction<MenuItem[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default menuSlice.reducer;

// Selector
export const selectMenu = (state: RootState) => state.trial;
