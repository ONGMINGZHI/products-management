import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validate fields
        if (!email || !password || !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
                email,
                password,
            });

            setSuccess("Registration successful!");

            // Go to login after registration
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>

            <form onSubmit={handleRegister}>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                </div>

                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>

                <div>
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" />
                </div>

                {error && <p className="error">{error}</p>}

                {success && <p className="success">{success}</p>}

                <button type="submit">Register</button>
            </form>

            <p className="login-link">
                Already have an account? <span onClick={() => navigate("/")}>Login</span>
            </p>
        </div>
    );
}

export default Register;
