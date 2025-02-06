import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import './Editnote.css'

const AddNote = () => {
    const [user, setUser] = useState(null);
    const [note, setNote] = useState("");
    const [noteTitle, setNoteTitle] = useState("");  // เพิ่ม state สำหรับชื่อโน้ต
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const navigate = useNavigate();

    // หมวดหมู่และสีที่สามารถเลือกได้
    const categories = [
        { label: "Work", value: "Work", color: "#86C8BC" },
        { label: "Pet", value: "Pet", color: "#CEEDC7" },
        { label: "Money", value: "Money", color: "#FFF6BD" },
        { label: "Others", value: "Others", color: "#FFD4B2" }
    ];

    useEffect(() => {
        // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/'); // ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้า Login
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // ฟังก์ชันบันทึกโน้ต
    const handleSaveNote = async () => {
        if (!noteTitle.trim()) {
            alert("กรุณากรอกชื่อโน้ต!");
            return;
        }

        if (!note.trim()) {
            alert("กรุณากรอกข้อความ!");
            return;
        }

        if (!category) {
            alert("กรุณาเลือกหมวดหมู่!");
            return;
        }

        try {
            await addDoc(collection(db, "notes"), {
                title: noteTitle,  // บันทึกชื่อโน้ต
                text: note,
                userId: user.uid, // บันทึกว่าโน้ตนี้เป็นของใคร
                category: category,
                color: color, // สีของหมวดหมู่
                createdAt: new Date(),
            });

            alert("บันทึกโน้ตสำเร็จ!");
            navigate('/user/mynote'); // กลับไปที่หน้า My Note
        } catch (error) {
            console.error("Error saving note: ", error);
        }
    };

    return (
        <div className="edit-note">
            <div className='edit-note-1'>
                <div className='box-title'>
                    <h3>Title</h3>

                    {/* ช่องกรอกชื่อโน้ต */}
                    <input
                        type="text"
                        placeholder="กรอกชื่อโน้ต..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                </div>
                <div className='box-category'>
                    {/* หมวดหมู่ที่เลือกเป็นปุ่ม */}
                    <div className="category-selector">
                        <h3>Category:</h3>
                        <div className="category-buttons">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    style={{ backgroundColor: cat.color }}
                                    className={`category-button ${category === cat.value ? 'active' : ''}`}
                                    onClick={() => {
                                        setCategory(cat.value);
                                        setColor(cat.color);
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className='edit-note-2'>
                <div className='box-note'>
                    <h3>Note</h3>

                    <textarea
                        placeholder="พิมพ์ข้อความที่นี่..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                </div>
            </div>


            <div className='edit-note-button'>
            <button onClick={() => navigate('/mynote')}>Cancel</button>
            <button onClick={handleSaveNote}>Save</button>
            </div>
        </div>
    );
};

export default AddNote;
