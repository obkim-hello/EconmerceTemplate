import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItem,
  addItem,
  decrementItem,
  clearCart,
} from "../../store/cartSlice";
import Navbar from "../../components/navbar/Navbar";
import { globalStore } from "../../store/globalStore";
import { useNavigate } from "react-router-dom";
import PayButton from "../../components/PayButton/PayButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function Cart() {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncrementItem = (item) => {
    dispatch(
      addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 })
    );
  };

  const handleDecrementItem = (item) => {
    if (item.quantity === 1) {
      dispatch(removeItem({ id: item.id }));
    } else {
      dispatch(
        decrementItem({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        })
      );
    }
  };
  const handleCheckout = () => {
    if (globalStore.getState().session.authenticated) {
      // navigate("/cart/");
      alert("Checkout successful!");
    } else {
      alert("You need to be logged in to proceed to checkout.");
      navigate("/login/?next=/cart");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h2>

        {cart.cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <Paper className="p-6">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover mr-4"
                          />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <IconButton
                            onClick={() => handleDecrementItem(item)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <span>{item.quantity}</span>
                          <IconButton
                            onClick={() => handleIncrementItem(item)}
                          >
                            <AddIcon />
                          </IconButton>
                        </div>
                      </TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-gray-800 font-semibold text-lg">
                Total: ${cart.totalPrice.toFixed(2)}
              </p>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
            <div className="mt-6">
              {globalStore.getState().session.authenticated ? (
                <PayButton cartItems={cart.cartItems} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login/?next=/cart")}
                >
                  Login to Checkout
                </Button>
              )}
            </div>
          </Paper>
        )}
      </div>
    </div>
  );
}
