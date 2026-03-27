import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send, ArrowRight } from 'lucide-react';

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef();
  const username = localStorage.getItem('chat_user');

  useEffect(() => {
    if (!username) navigate('/');

    // حل مشكلة عدم ظهور الرسائل: استخدام onSnapshot للمزامنة الحية
    const q = query(
      collection(db, "messages"),
      where("roomId", "==", roomId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      // تمرير تلقائي لأسفل المحادثة
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [roomId, username, navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageContent = input;
    setInput('');

    try {
      await addDoc(collection(db, "messages"), {
        text: messageContent,
        sender: username,
        roomId: roomId,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0e11] text-white">
      {/* Header */}
      <div className="p-4 bg-[#15191c] flex items-center gap-4 border-b border-gray-800 shadow-lg">
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition">
          <ArrowRight size={24} />
        </button>
        <div>
          <h2 className="font-bold text-lg">غرفة: <span className="text-[#00a884]">{roomId}</span></h2>
          <p className="text-[10px] text-gray-500">مشفرة بالكامل</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === username ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl ${
              m.sender === username 
                ? 'bg-[#00a884] text-black rounded-tl-none' 
                : 'bg-[#15191c] text-white rounded-tr-none border border-gray-700'
            }`}>
              <p className="text-[10px] font-bold opacity-60 mb-1">{m.sender}</p>
              <p className="text-sm leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-[#15191c] border-t border-gray-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك السرية..."
          className="flex-1 bg-black border border-gray-700 p-4 rounded-xl outline-none focus:border-[#00a884] transition"
        />
        <button type="submit" className="bg-[#00a884] p-4 rounded-xl text-black hover:bg-[#008f6f] transition transform active:scale-95">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}