import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodservice';
import { toast } from 'react-toastify';

const AddFood = () => {

    const [image, setImage] = useState(null);

    const [data, setData] = useState({
        name: '',
        description: '',
        category: '',
        price: ''
    });

    // Handle input changes
    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData((data) => ({
            ...data,
            [name]: value
        }));
    };

    // Handle form submission
    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // Check image
        if (!image) {
            toast.error('Please upload an image');
            return;
        }

        try {
            // Call addFood from foodservice.js
            await addFood(data, image);

            toast.success('Food added successfully');

            // Reset form
            setData({
                name: '',
                description: '',
                category: '',
                price: ''
            });

            setImage(null);

        } catch (error) {
            console.error(error);
            toast.error('Failed to add food');
        }
    };

    return (
        <div className="mx-2 mt-4">

            <div className="card col-md-4">

                <div className="card-body p-4">

                    <h2 className="mb-4">Add Food</h2>

                    <form onSubmit={onSubmitHandler}>

                        {/* Name */}
                        <div className="mb-3">

                            <label
                                htmlFor="name"
                                className="form-label"
                            >
                                Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter food name"
                                className="form-control"
                                id="name"
                                name="name"
                                required
                                value={data.name}
                                onChange={onChangeHandler}
                            />

                        </div>


                        {/* Image */}
                        <div className="mb-3">

                            <label
                                htmlFor="image"
                                className="form-label"
                            >

                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : assets.upload
                                    }
                                    alt="Upload"
                                    style={{
                                        width: '150px',
                                        height: '100px',
                                        cursor: 'pointer',
                                        objectFit: 'cover'
                                    }}
                                />

                                <div>Upload Image</div>

                            </label>

                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                name="image"
                                accept="image/*"
                                required
                                hidden
                                onChange={(e) => {
                                    setImage(e.target.files[0]);
                                }}
                            />

                        </div>


                        {/* Description */}
                        <div className="mb-3">

                            <label
                                htmlFor="description"
                                className="form-label"
                            >
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                placeholder="Enter food description"
                                id="description"
                                name="description"
                                rows="5"
                                required
                                value={data.description}
                                onChange={onChangeHandler}
                            ></textarea>

                        </div>


                        {/* Category */}
                        <div className="mb-3">

                            <label
                                htmlFor="category"
                                className="form-label"
                            >
                                Category
                            </label>

                            <select
                                name="category"
                                id="category"
                                className="form-control"
                                required
                                value={data.category}
                                onChange={onChangeHandler}
                            >

                                <option value="">
                                    Select a category
                                </option>

                                <option value="Cake">
                                    Cake
                                </option>

                                <option value="Biryani">
                                    Biryani
                                </option>

                                <option value="Dessert">
                                    Dessert
                                </option>

                                <option value="Burger">
                                    Burger
                                </option>

                                <option value="Salad">
                                    Salad
                                </option>

                                <option value="Pizza">
                                    Pizza
                                </option>

                                <option value="IceCream">
                                    IceCream
                                </option>

                            </select>

                        </div>


                        {/* Price */}
                        <div className="mb-3">

                            <label
                                htmlFor="price"
                                className="form-label"
                            >
                                Price
                            </label>

                            <input
                                type="number"
                                placeholder="&#8377; 0.00"
                                className="form-control"
                                id="price"
                                name="price"
                                required
                                value={data.price}
                                onChange={onChangeHandler}
                            />

                        </div>


                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Save
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default AddFood;