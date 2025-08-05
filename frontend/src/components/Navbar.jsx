import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">ShivSatvik</Link>
      </div>
      <div className={styles.links}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button className={styles.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
