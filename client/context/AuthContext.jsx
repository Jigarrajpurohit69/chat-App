import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api.js"; // ✅ centralized API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

    // 🔹 Check authentication
    const checkAuth = async () => {
        try {
            const { data } = await api.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 🔹 Login
    const login = async (state, credentials) => {
        try {
            const { data } = await api.post(`/api/auth/${state}`, credentials);

            if (data.success) {
                setAuthUser(data.userData);
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    // 🔹 Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        toast.success("Logged out successfully");
    };

    // 🔹 Update profile
    const updateProfile = async (body) => {
        try {
            const { data } = await api.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            toast.error("Profile update failed");
        }
    };

    // 🔹 Attach token & check auth on load
    useEffect(() => {
        if (token) {
            api.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, [token]);

    const value = {
        authUser,
        onlineUsers,
        login,
        logout,
        updateProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
