import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { setAvatarRoute } from '../utils/ApiRoutes';
import loader from '../assets/loader.gif';
import { Buffer } from 'buffer';

function SetAvatar() {
    const api = "https://api.multiavatar.com/4645646";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // loader.gif
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "top-right",
        theme: "dark",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
    };

    useEffect(() => {
        if (!localStorage.getItem(process.env.LOCAL_HOST_KEY)) {
            navigate('/login');
        }
    });

    const setDisplayPicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar.", toastOptions);
        }
        else {
            const user = await JSON.parse(localStorage.getItem(process.env.LOCAL_HOST_KEY));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });

            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem(process.env.LOCAL_HOST_KEY, JSON.stringify(user));
                navigate('/');
            }
            else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    };
    useEffect(() => {
        (async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(
                    `${api}/${Math.round(Math.random() * 1000)}`
                );
                const buffer = new Buffer(image.data);
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            {
                isLoading ? (<div className="avatar-container">
                    <img src={loader} alt="loader" className='loader' />
                </div>) : (
                    <div className="avatar-container">
                        <div className="title">
                            <h1>Choose an avatar as your display picture</h1>
                        </div>
                        <div className="avatars">
                            {avatars.map((avatar, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={`avatar ${selectedAvatar === i ? "selected" : ""
                                            }`}
                                    >
                                        <img src={`data:image/svg+xml;base64,${avatar}`} key={avatar} alt="avatar" onClick={() => setSelectedAvatar(i)} />
                                    </div>
                                );
                            })
                            }
                        </div>
                        <button className='submit-btn' onClick={setDisplayPicture}>Set Display Picture</button>
                        <ToastContainer />
                    </div>
                )
            }
        </>
    )
}

export default SetAvatar;