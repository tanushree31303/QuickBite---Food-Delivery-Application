
import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../util/cartUtils";
import { RAZORPAY_KEY } from "../../service/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    createOrder,
    deleteOrder,
    verifyPayment
} from "../../service/orderService";
import { clearCartItems } from "../../service/cartService";

const PlaceOrder = () => {

    const {
        foodList,
        quantities,
        token,
        setQuantities
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        state: "",
        city: "",
        zip: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setData((data) => ({
            ...data,
            [name]: value
        }));
    };

    // Cart items
    const cartItems = foodList.filter(
        (food) => quantities[food.id] > 0
    );

    // Cart calculations
    const { subtotal, shipping, tax, total } =
        calculateCartTotals(cartItems, quantities);

    const OnSubmitHandler = async (event) => {

        event.preventDefault();

        const orderData = {
    userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,

    phoneNumber: data.phoneNumber,

    email: data.email,

    orderedItems: cartItems.map((item) => ({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name
    })),

    amount: Math.round(total * 100),

    orderStatus: "Preparing"
};
        try {

            const response = await createOrder(orderData, token);

            if (
                response &&
                response.razorpayOrderId
            ) {
                initiateRazorpayPayment(response);
            } else {
                toast.error("Unable to place order.");
            }

        } catch (error) {

            console.error(error);
            toast.error("Unable to place order.");

        }
    };

    const initiateRazorpayPayment = (order) => {

        const options = {

            key: RAZORPAY_KEY,

            amount: order.amount,

            currency: "INR",

            name: "QuickBite",

            description: "Food Order",

            order_id: order.razorpayOrderId,

            handler: verifyPaymentHandler,

            prefill: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                contact: data.phoneNumber
            },

            theme: {
                color: "#3399cc"
            },

            modal: {
                ondismiss: () => {
                    toast.error("Payment cancelled.");
                }
            }
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();
    };

    const verifyPaymentHandler = async (razorpayResponse) => {

        const paymentData = {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_signature: razorpayResponse.razorpay_signature
        };

        try {

            const success = await verifyPayment(
                paymentData,
                token
            );

            if (success) {

                toast.success("Payment successful.");

                await clearCart();

                navigate("/myorders");

            } else {

                toast.error("Payment failed. Please try again.");

                navigate("/");

            }

        } catch (error) {

            console.error(error);

            toast.error("Payment failed. Please try again.");

        }
    };

    const clearCart = async () => {

        try {

            await clearCartItems(
                token,
                setQuantities
            );

        } catch (error) {

            console.error(error);

            toast.error("Error while clearing the cart.");

        }
    };

    return (
        <div className="container mt-4">

            <main>

                <div className="py-5 text-center">

                    <img
                        className="d-block mx-auto"
                        src={assets.logo1}
                        alt="QuickBite Logo"
                        width="200"
                        height="98"
                    />

                </div>

                <div className="row g-5">

                    {/* CART SUMMARY */}

                    <div className="col-md-5 col-lg-4 order-md-last">

                        <h4 className="d-flex justify-content-between align-items-center mb-3">

                            <span className="text-primary">
                                Your cart
                            </span>

                            <span className="badge bg-primary rounded-pill">
                                {cartItems.length}
                            </span>

                        </h4>

                        <ul className="list-group mb-3">

                            {cartItems.map((item) => (

                                <li
                                    key={item.id}
                                    className="list-group-item d-flex justify-content-between lh-sm"
                                >

                                    <div>

                                        <h6 className="my-0">
                                            {item.name}
                                        </h6>

                                        <small className="text-body-secondary">
                                            Qty: {quantities[item.id]}
                                        </small>

                                    </div>

                                    <span className="text-body-secondary">
                                        ₹{(
                                            item.price * quantities[item.id]
                                        ).toFixed(2)}
                                    </span>

                                </li>

                            ))}

                            <li className="list-group-item d-flex justify-content-between">

                                <span>
                                    Subtotal
                                </span>

                                <span className="text-body-secondary">
                                    ₹{subtotal.toFixed(2)}
                                </span>

                            </li>

                            <li className="list-group-item d-flex justify-content-between">

                                <span>
                                    Shipping
                                </span>

                                <span className="text-body-secondary">
                                    ₹{shipping.toFixed(2)}
                                </span>

                            </li>

                            <li className="list-group-item d-flex justify-content-between">

                                <span>
                                    Tax (10%)
                                </span>

                                <span className="text-body-secondary">
                                    ₹{tax.toFixed(2)}
                                </span>

                            </li>

                            <li className="list-group-item d-flex justify-content-between">

                                <span>
                                    Total (INR)
                                </span>

                                <strong>
                                    ₹{total.toFixed(2)}
                                </strong>

                            </li>

                        </ul>

                    </div>

                    {/* BILLING ADDRESS */}

                    <div className="col-md-7 col-lg-8">

                        <h4 className="mb-3">
                            Billing address
                        </h4>

                        <form
                            className="needs-validation"
                            onSubmit={OnSubmitHandler}
                        >

                            <div className="row g-3">

                                <div className="col-sm-6">

                                    <label
                                        htmlFor="firstName"
                                        className="form-label"
                                    >
                                        First name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="firstName"
                                        placeholder="John"
                                        required
                                        name="firstName"
                                        onChange={onChangeHandler}
                                        value={data.firstName}
                                    />

                                </div>

                                <div className="col-sm-6">

                                    <label
                                        htmlFor="lastName"
                                        className="form-label"
                                    >
                                        Last name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="lastName"
                                        placeholder="Doe"
                                        required
                                        name="lastName"
                                        onChange={onChangeHandler}
                                        value={data.lastName}
                                    />

                                </div>

                                <div className="col-12">

                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email
                                    </label>

                                    <div className="input-group">

                                        <span className="input-group-text">
                                            @
                                        </span>

                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Email"
                                            required
                                            name="email"
                                            onChange={onChangeHandler}
                                            value={data.email}
                                        />

                                    </div>

                                </div>

                                <div className="col-12">

                                    <label
                                        htmlFor="phone"
                                        className="form-label"
                                    >
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        placeholder="91"
                                        required
                                        name="phoneNumber"
                                        onChange={onChangeHandler}
                                        value={data.phoneNumber}
                                    />

                                </div>

                                <div className="col-12">

                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Address
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        placeholder="1234 Main St"
                                        required
                                        name="address"
                                        onChange={onChangeHandler}
                                        value={data.address}
                                    />

                                </div>

                                <div className="col-md-5">

                                    <label
                                        htmlFor="state"
                                        className="form-label"
                                    >
                                        State
                                    </label>

                                    <select
                                        className="form-select"
                                        id="state"
                                        required
                                        name="state"
                                        value={data.state}
                                        onChange={onChangeHandler}
                                    >

                                        <option value="">
                                            Choose...
                                        </option>

                                        <option value="Telangana">
                                            Telangana
                                        </option>

                                        <option value="Karnataka">
                                            Karnataka
                                        </option>

                                        <option value="Kerala">
                                            Kerala
                                        </option>

                                        <option value="Andhra Pradesh">
                                            Andhra Pradesh
                                        </option>

                                    </select>

                                </div>

                                <div className="col-md-4">

                                    <label
                                        htmlFor="city"
                                        className="form-label"
                                    >
                                        City
                                    </label>

                                    <select
                                        className="form-select"
                                        id="city"
                                        required
                                        name="city"
                                        value={data.city}
                                        onChange={onChangeHandler}
                                    >

                                        <option value="">
                                            Choose...
                                        </option>

                                        <option value="Hyderabad">
                                            Hyderabad
                                        </option>

                                        <option value="Bangalore">
                                            Bangalore
                                        </option>

                                        <option value="Vijayawada">
                                            Vijayawada
                                        </option>

                                    </select>

                                </div>

                                <div className="col-md-3">

                                    <label
                                        htmlFor="zip"
                                        className="form-label"
                                    >
                                        Zip
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        id="zip"
                                        placeholder="520001"
                                        required
                                        name="zip"
                                        value={data.zip}
                                        onChange={onChangeHandler}
                                    />

                                </div>

                            </div>

                            <hr className="my-4" />

                            <button
                                className="w-100 btn btn-primary btn-lg"
                                type="submit"
                                disabled={cartItems.length === 0}
                            >
                                Continue to checkout
                            </button>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default PlaceOrder;

