import React, { useState } from "react";
import Chat from "./Chat";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || 'https://chat-app-nida.onrender.com/api';

    const register = async () => {
        setLoading(true);
        try {
            fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
              });
            if (response.ok) {
                alert("Registration successful!");
            } else {
                const error = await response.json();
                alert(error.message || "Registration failed!");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const login = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                setLoggedIn(true);
            } else {
                const error = await response.json();
                alert(error.message || "Login failed!");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!loggedIn) {
        return (
            <div className="auth-container">
                <h2>Register / Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={register} disabled={loading}>Register</button>
                <button onClick={login} disabled={loading}>Login</button>
            </div>
        );
    }

    return <Chat username={username} />;
}

export default App;
