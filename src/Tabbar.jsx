import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './firebase.js'; // นำเข้า onAuthStateChanged
import './Tabbar.css';

const Tabbar = () => {
    const [userEmail, setUserEmail] = useState(null); // กำหนดสถานะเพื่อเก็บอีเมลของผู้ใช้
    const navigate = useNavigate();
    const location = useLocation();  // ใช้ useLocation เพื่อตรวจสอบ pathname

    // ตรวจสอบสถานะผู้ใช้เมื่อมีการเปลี่ยนแปลง
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login'); // ถ้าไม่พบผู้ใช้ที่ล็อกอินให้ไปหน้า login
            } else {
                setUserEmail(user.email); // ตั้งค่าอีเมลของผู้ใช้
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className='tabbar'>
            <div className='title'>NOTE EASY</div>
            <div className='tabs'>
                <Link to="/user/mynote"
                    className={`tab ${location.pathname === '/user/mynote' ? 'active' : ''}`}> {/* ตรวจสอบว่า pathname ตรงกับ path ของแท็บนี้หรือไม่ */}
                    My Note
                </Link>
                <Link to="/user/creat"
                    className={`tab ${location.pathname === '/user/creat' ? 'active' : ''}`}>
                    + Add Note
                </Link>
                <Link to="/login"
                    className={`tab ${location.pathname === '/login' ? 'active' : ''}`}>
                    Log Out
                </Link>
            </div>
        </div>
    );
};

export default Tabbar;
