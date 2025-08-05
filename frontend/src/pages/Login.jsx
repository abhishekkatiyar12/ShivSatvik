import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.authBtn}>Login</button>
      </form>
    </div>
  );
}
