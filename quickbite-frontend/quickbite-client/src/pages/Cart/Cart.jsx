
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './Cart.css';
import { calculateCartTotals } from "../../util/cartUtils";

const Cart = () => {

    const navigate = useNavigate();

    const { foodList, increaseQty, decreaseQty, quantities,removeFromCart} = useContext(StoreContext);

    const cartItems = foodList.filter(food => quantities[food.id] > 0);


    //calculations
 const {subtotal , shipping , tax , total} =  calculateCartTotals(cartItems,quantities);

    return (
        <div className="container py-5 cart-container">

            <h1 className="mb-5">
                Your Shopping Cart
            </h1>

            <div className="row">

                {/* CART ITEMS */}
                <div className="col-lg-8">

                    {cartItems.length === 0 ? (

                        <p>Your Cart is Empty</p>

                    ) : (

                        <div className="card mb-4">
                            <div className="card-body">

                                {cartItems.map((food, index) => (

                                    <div key={food.id}>

                                        <div className="row cart-item mb-3">

                                            {/* Image */}
                                            <div className="col-md-3 cart-image">
                                                <img
                                                    src={food.imageUrl}
                                                    alt={food.name}
                                                    className="img-fluid rounded"
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className="col-md-5 cart-details">

                                                <h5 className="card-title">
                                                    {food.name}
                                                </h5>

                                                <p className="text-muted">
                                                    Category: {food.category}
                                                </p>

                                                <p className="text-muted">
                                                    ₹{food.price} each
                                                </p>

                                            </div>

                                            {/* Quantity */}
                                            <div className="col-md-2 cart-quantity">

                                                <div className="input-group">

                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        type="button"
                                                        onClick={() => decreaseQty(food.id)}
                                                    >
                                                        -
                                                    </button>

                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm text-center quantity-input"
                                                        value={quantities[food.id]}
                                                        readOnly
                                                    />

                                                    <button
                                                        className="btn btn-outline-secondary btn-sm"
                                                        type="button"
                                                        onClick={() => increaseQty(food.id)}
                                                    >
                                                        +
                                                    </button>

                                                </div>

                                            </div>

                                            {/* Price */}
                                            <div className="col-md-2 text-end cart-price">

                                                <p className="fw-bold">
                                                    ₹{food.price * quantities[food.id]}
                                                </p>

                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={()=>removeFromCart(food.id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>

                                            </div>

                                        </div>

                                        {index < cartItems.length - 1 && <hr />}

                                    </div>

                                ))}

                            </div>
                        </div>

                    )}

                    {/* Continue Shopping */}
                    <div className="mb-4">

                        <Link
                            to="/"
                            className="btn btn-outline-secondary"
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Continue Shopping
                        </Link>

                    </div>

                </div>


                {/* ORDER SUMMARY */}
                <div className="col-lg-4">

                    <div className="card cart-summary">

                        <div className="card-body">

                            <h5 className="card-title mb-4">
                                Order Summary
                            </h5>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Tax</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong>₹{total.toFixed(2)}</strong>
                            </div>

                            <button
                                className="btn btn-primary w-100"
                                type="button"
                                disabled={cartItems.length === 0} onClick={()=>navigate("/order")}
                            >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Cart;

