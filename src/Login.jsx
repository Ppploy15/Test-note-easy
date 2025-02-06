import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // ฟังก์ชัน Login
  const handleLogin = async () => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError("");
    } catch (err) {
      setError("เข้าสู่ระบบไม่สำเร็จ! กรุณาตรวจสอบอีเมลหรือรหัสผ่าน");
    }
  };

  // ฟังก์ชัน Register
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError("");
    } catch (err) {
      setError("สมัครสมาชิกไม่สำเร็จ! อาจมีอีเมลนี้ในระบบแล้ว");
    }
  };

  // ฟังก์ชัน Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div style={styles.container}>
      <h2>เข้าสู่ระบบ</h2>
      {error && <p style={styles.error}>{error}</p>}
      
      {!user ? (
        <>
          <input type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} />
          <input type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </>
      ) : (
        <>
          <p>เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

// CSS
const styles = {
  container: { textAlign: "center", padding: "20px" },
  error: { color: "red" }
};

export default Login;
