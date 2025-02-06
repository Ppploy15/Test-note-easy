import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, getDocs, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Mynote.css'
import { onAuthStateChanged } from "firebase/auth";

const Mynote = () => {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState('createdAt');
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();

    const categories = {
        Work: "#86C8BC",
        Pet: "#CEEDC7",
        Money: "#FFF6BD",
        Others: "#FFD4B2"
    };


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUserName(userDoc.data().name);
                    }

                    const q = query(collection(db, "notes"), where("userId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const notesData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setNotes(notesData);
                } catch (error) {
                    console.error("Error fetching notes:", error);
                }
            } else {
                setNotes([]); // เคลียร์โน้ตถ้าไม่มีผู้ใช้ล็อกอิน
            }
        });

        return () => unsubscribe(); // Cleanup function เพื่อหยุดฟังเมื่อ component ถูก unmount
    }, []);


    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "notes", id));
            setNotes(notes.filter(note => note.id !== id));
            alert("ลบโน้ตสำเร็จ");
        } catch (error) {
            console.error("Error deleting note: ", error);
        }
    };

    const handleEdit = (note) => {
        navigate(`/user/edit-note/${note.id}`);
        // ไปหน้า Editnote พร้อมกับ id ของโน้ต
    };


    const filteredNotes = notes.filter(note =>
        note.title && note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedNotes = filteredNotes.sort((a, b) => {
        if (sortBy === 'createdAt') {
            return b.createdAt.seconds - a.createdAt.seconds;
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'category') {
            return a.category.localeCompare(b.category);
        }
        return 0;
    });

    return (

        <div className='mynote'>
            <h2>{userName}</h2>
            <div className='layout-sort'>
                <input
                    className='search'
                    type="text"
                    placeholder="search note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className='category'>
                    <p>Category<img src="/images/navigate.png" /></p>
                    
                    <div className='submenu'>
                       <div className='sort'>
                        <button onClick={() => setSortBy('createdAt')} />
                        Sort by date
                    </div>
                    <div className='sort'>
                        <button onClick={() => setSortBy('title')} />
                        Sort by title
                    </div>
                    <div className='sort'>
                        <button onClick={() => setSortBy('category')} />
                        Sort by category
                    </div> 
                    </div>
                    
                </div>
            </div>
            <div className='notes'>
                {sortedNotes.map((note) => (
                    <div className='note' key={note.id}>
                        <button className='delete' onClick={() => handleDelete(note.id)} >X</button>
                        <div className='title'>{note.title}</div>
                        <div className='note-1'>Created by: {userName} {new Date(note.createdAt.seconds * 1000).toLocaleDateString()}</div>
                        <div className='note-1'>Last update:</div>

                        <div className='note-3' style={{
                            backgroundColor: categories[note.category] || "#000",
                        }}>
                            {note.category}
                        </div>

                        <div className='note-4'> {note.text}</div>

                        <button className='note-5' onClick={() => handleEdit(note)} >Edit</button>
                    </div>

                ))}

            </div>
        </div>
    );
};

export default Mynote;
