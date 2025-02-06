import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './Editnote.css'


const Editnote = () => {
    const { id } = useParams(); 
    const [user, setUser] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [note, setNote] = useState("");
    const [category, setCategory] = useState("");
    const [color, setColor] = useState("");
    const navigate = useNavigate();

    const categories = [
        { label: "Work", value: "Work", color: "#86C8BC" },
        { label: "Pet", value: "Pet", color: "#CEEDC7" },
        { label: "Money", value: "Money", color: "#FFF6BD" },
        { label: "Others", value: "Others", color: "#FFD4B2" }
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login'); 
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchNote = async () => {
            if (!id) return;
            try {
                const noteRef = doc(db, "notes", id);
                const noteSnap = await getDoc(noteRef);

                if (noteSnap.exists()) {
                    const noteData = noteSnap.data();
                    setNoteTitle(noteData.title || "");
                    setNote(noteData.text || "");
                    setCategory(noteData.category || "");
                    setColor(noteData.color || "");
                } else {
                    alert("ไม่พบโน้ตนี้");
                    navigate('/user/mynote');
                }
            } catch (error) {
                console.error("Error loading note: ", error);
            }
        };
        fetchNote();
    }, [id, navigate]);

    const handleEditNote = async () => {
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
            const noteRef = doc(db, "notes", id);
            await updateDoc(noteRef, {
                title: noteTitle,
                text: note,
                category: category,
                color: color,
                updatedAt: new Date()
            });

            alert("แก้ไขโน้ตสำเร็จ!");
            navigate('/user/mynote'); 
        } catch (error) {
            console.error("Error updating note: ", error);
        }
    };

    return (
        <div className="edit-note">
            <div className='edit-note-1'>
                <div className='box-title'>
                    <h3>Title</h3>

                    <input
                        type="text"
                        placeholder="กรอกชื่อโน้ต..."
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                    />
                </div>
                <div className='box-category'>
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
            <button onClick={() => navigate('/user/mynote')}>Cancel</button>
            <button onClick={handleEditNote}>Save Changes</button>
            </div>
        </div>
    );
};

export default Editnote;
