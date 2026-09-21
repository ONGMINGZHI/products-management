import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        // Validate fields
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                email,
                password,
            });

            // Store JWT
            localStorage.setItem("token", response.data.token);

            // Go to products
            navigate("/products");
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit">Login</button>
                <button onClick={() => navigate("/register")}>Create an account</button>
            </form>
        </div>
    );
}

export default Login;
