import React, { useState } from 'react';
import './Login1.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.js";

function Login1() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ฟังก์ชัน Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            setError("");
            navigate("/user/mynote");  // ⬅ เปลี่ยนหน้าไปที่ My Note
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

    return (
        <div className='login'>
            <img className='circle' src='/images/circel.png' alt="Background" />
            <div className='box-login'>
                <div className='box-login-1'>
                    <div className='left'>Login</div>
                    <Link to={'/signup'} className='button-signup'>Sign Up</Link>
                </div>

                {!user ? (
                    <form className='form-login' onSubmit={handleLogin}>
                        <div className='box-login-2'>
                            <img src="/images/img-mail.png" alt="Email Icon" />
                            <input
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='box-login-3'>
                            <img src="/images/img-password.png" alt="Password Icon" />
                            <input
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='box-login-4'>
                            Forgot your password?
                        </div>

                        <button type="submit" className='button-login'>Login</button>
                    </form>
                ) : (
                    <div>
                        <p>เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ {user.email}</p>
                        <button onClick={() => setUser(null)} className='button-login'>Logout</button>
                    </div>
                )}

                

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Login1;
