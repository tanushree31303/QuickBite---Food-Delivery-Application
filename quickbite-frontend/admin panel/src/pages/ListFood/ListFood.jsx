import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ListFood.css';
import { getFoodList, deleteFood } from '../../services/foodservice';
const ListFood = () => {
    const [list, setList] = useState([]);
    const fetchList = async () => {
        try {
            const data = await getFoodList();
            setList(data);
        }
        catch (error) {
            toast.error('Error fetching food list');
        }
    }

    const removeFood = async (foodId) => {
        try {
            const success = await deleteFood(foodId);
            if (success) {
                toast.success('Food deleted successfully');
                await fetchList();
            }
            else {
                toast.error('Error deleting food');
            }
        }
        catch (error) {
            toast.error('Error deleting food');
        }
    };

    useEffect(() => {
        fetchList();
    }, []);
    return (
        <div className="py-5 row justify-content-center">
            <div className="col-11 card">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            <img src={item.imageUrl} alt="" width='48' height='48' />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>₹{item.price.toFixed(2)}</td>
                                        <td className='text-danger'>
                                            <i className="bi bi-trash-fill ml-2" onClick={() => removeFood(item.id)}></i>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListFood;


