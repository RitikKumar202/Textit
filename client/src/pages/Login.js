import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute } from '../utils/ApiRoutes';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: "",
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
            const { password, username } = values;
            const { data } = await axios.post(loginRoute, {
                username,
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
        const { password, username } = values;
        if (password === "") {
            toast.error("Username and Password are required.", toastOptions);
            return false;
        }
        else if (username.length === "") {
            toast.error("Username and Password are required.", toastOptions);
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
                        min='3'
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name='password'
                        onChange={(e) => handleChange(e)}
                    />
                    <button className='lg-btn' type='submit'>Login</button>
                    <span>
                        Don't have an account? <Link to='/register'>Register here</Link>
                    </span>
                </form>
            </div>
            <ToastContainer />
        </>
    )
};

export default Login;