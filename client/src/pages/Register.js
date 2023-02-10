import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { registerRoute } from '../utils/ApiRoutes';

function Register() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const toastOptions = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
    }

    useEffect(() => {
        if (localStorage.getItem(process.env.LOCAL_HOST_KEY)) {
            navigate('/');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { password, username, email } = values;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem(process.env.LOCAL_HOST_KEY, JSON.stringify(data.user));
                navigate("/");
            }
        }
    };

    const handleValidation = () => {
        const { password, confirmPassword, username, email } = values;
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password must be same.",
                toastOptions
            );
            return false;
        }
        else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters.", toastOptions);
            return false;
        }
        else if (password.length < 8) {
            toast.error("Password must be greater than or equal to 8 characters.", toastOptions);
            return false;
        }
        else if (email === "") {
            toast.error("Email is required.", toastOptions);
            return false;
        }
        return true;
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className='main'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <h1>Text<span>it.</span></h1>
                    </div>
                    <input
                        type="text"
                        placeholder='Username'
                        name='username'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="email"
                        placeholder='Email'
                        name='email'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        onChange={(e) => handleChange(e)}
                    />
                    <input
                        type="password"
                        placeholder='Confirm Password'
                        name='confirmPassword'
                        onChange={(e) => handleChange(e)}
                    />
                    <button className='reg-btn' type='submit'>Create Account</button>
                    <span>
                        Already have an account? <Link to='/login'>Login here</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
};

export default Register