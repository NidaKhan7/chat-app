import React, { useState } from "react";
import Chat from "./Chat";

function App() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const register = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                alert("Registration successful!");
            } else {
                alert("Registration failed!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const login = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                setLoggedIn(true);
            } else {
                alert("Login failed!");
            }
        } catch (err) {
            console.error(err);
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
                <button onClick={register}>Register</button>
                <button onClick={login}>Login</button>
            </div>
        );
    }

    return <Chat username={username} />;
}

export default App;
