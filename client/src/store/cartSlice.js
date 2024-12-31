import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        existingItem.totalPrice +=
          action.payload.price * action.payload.quantity;
      } else {
        state.cartItems.push({
          ...action.payload,
          totalPrice: action.payload.price * action.payload.quantity,
        });
      }

      state.totalQuantity += action.payload.quantity;
      state.totalPrice += action.payload.price * action.payload.quantity;
    },
    decrementItem: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity -= action.payload.quantity;
        existingItem.totalPrice -=
          action.payload.price * action.payload.quantity;
      }

      state.totalQuantity -= action.payload.quantity;
      state.totalPrice -= action.payload.price * action.payload.quantity;
    },
    removeItem: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        state.totalQuantity -= item.quantity;
        state.totalPrice -= item.totalPrice;
        state.cartItems.splice(itemIndex, 1);
      }
    },
    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.totalQuantity = quantity;
      state.totalPrice = total;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addItem, removeItem, clearCart, decrementItem, getTotals } =
  cartSlice.actions;
export default cartSlice.reducer;
