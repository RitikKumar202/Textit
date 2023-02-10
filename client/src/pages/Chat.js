import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/ApiRoutes';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

function Chat() {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();
    const [currentChat, setCurrentChat] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            if (!localStorage.getItem(process.env.LOCAL_HOST_KEY)) {
                navigate('/login');
            }
            else {
                setCurrentUser(await JSON.parse(localStorage.getItem(process.env.LOCAL_HOST_KEY)));
                setIsLoaded(true);
            }
        })();
    }, [])

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        (async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);
                }
                else {
                    navigate('/setAvatar');
                }
            }
        })();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    }

    return (
        <>
            <div className="chat-container">
                <div className="container">
                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
                    {
                        isLoaded && currentChat === undefined ? (
                            <Welcome currentUser={currentUser} />
                        ) : (
                            <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Chat;