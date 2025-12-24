import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api.js";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    // 🔹 Get users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await api.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            toast.error("Failed to load users");
        }
    };

    // 🔹 Get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await api.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error("Failed to load messages");
        }
    };

    // 🔹 Send message
    const sendMessage = async (messageData) => {
        if (!selectedUser) return;

        try {
            const { data } = await api.post(
                `/api/messages/send/${selectedUser._id}`,
                messageData
            );

            if (data.success) {
                setMessages((prev) => [...prev, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    // 🔹 Reload messages when user changes
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        unseenMessages,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
