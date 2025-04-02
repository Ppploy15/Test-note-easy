import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";

function Signup() {
    const [name, setName] = useState("");  // เพิ่ม state สำหรับชื่อ
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ฟังก์ชัน Register
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("กรุณากรอกชื่อ!");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // บันทึกข้อมูล user ลง Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: user.email,
                createdAt: new Date()
            });

            setError("");
            alert("สมัครสมาชิกสำเร็จ!");
            navigate("/user/mynote");  // เปลี่ยนหน้าไปที่ My Notes
        } catch (err) {
            setError("สมัครสมาชิกไม่สำเร็จ! อาจมีอีเมลนี้ในระบบแล้ว");
        }
    };

    return (
        <div className='signup'>
            <img className='circle' src='/images/circel.png' alt="Background" />
            <div className='box-signup'>
                <div className='box-signup-1'>
                    <Link to={'/'} className='left'>Login</Link>
                    <div className='button-signup'>Sign up</div>
                </div>

                <form className='form-signup' onSubmit={handleRegister}>
                    <div className='box-signup-2'>
                        <img src="/images/img-login.png" alt="User Icon" />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='box-signup-3'>
                        <img src="/images/img-mail.png" alt="Email Icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='box-signup-3'>
                        <img src="/images/img-password.png" alt="Password Icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className='button-login'>Sign up</button>
                </form>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Signup;
