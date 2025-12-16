import { createAsyncThunk, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { menuItem } from "@/types/types";
interface Item extends menuItem {
  quantity: number;
  selectedProtein?: string;
  selectedSize?: "regular" | "jumbo";
  cartItemId?: string; // Unique identifier for cart items
}

// Helper function to generate unique cart item ID
function getCartItemId(item: Item): string {
  if (item.cartItemId) return item.cartItemId;
  // Create unique ID based on title + protein + size
  const protein = item.selectedProtein || "default";
  const size = item.selectedSize || "regular";
  return `${item.title}-${protein}-${size}`;
}

export const addItemsToCart = createAsyncThunk(
  "cart/addItemsToCart",
  async (body: Item) => {
    return body;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [] as Item[],
    totalAmt: 0,
    loading: "idle",
  },
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmt = 0;
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (item) => getCartItemId(item) === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
      state.totalAmt = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (item) => getCartItemId(item) === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      state.totalAmt = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => getCartItemId(item) !== action.payload
      );
      state.totalAmt = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemsToCart.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(
        addItemsToCart.fulfilled,
        (state, action: PayloadAction<Item>) => {
          state.loading = "succeeded";

          // Generate unique cart item ID
          const newItemId = getCartItemId(action.payload);
          const itemWithId = {
            ...action.payload,
            cartItemId: newItemId,
          };

          // Find existing item by unique ID (title + protein + size)
          const existingItem = state.cartItems.find(
            (item) => getCartItemId(item) === newItemId
          );

          if (existingItem) {
            existingItem.quantity += action.payload.quantity;
          } else {
            state.cartItems.push(itemWithId);
          }
          state.totalAmt = state.cartItems.reduce(
            (total, item) => total + Number(item.price) * item.quantity,
            0
          );
        }
      )
      .addCase(addItemsToCart.rejected, (state) => {
        state.loading = "failed";
      });
  },
});
export const selectTotalQuantity = (state: RootState) =>
  state.cart.cartItems?.reduce(
    (total: number, item: Item) => total + (item.quantity ?? 0),
    0
  ) || 0;
export const { incrementQuantity, decrementQuantity, removeItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
