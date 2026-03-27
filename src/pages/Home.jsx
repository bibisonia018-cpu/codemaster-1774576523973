import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim() && room.trim()) {
      localStorage.setItem('chat_user', username);
      navigate(`/chat/${room.trim()}`);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0b0e11] p-4">
      <div className="w-full max-w-md p-8 bg-[#15191c] rounded-2xl border border-gray-800 shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-[#00a884] mb-2">تطبيق الدردشة السرية</h1>
        <p className="text-gray-400 mb-8 text-sm">أدخل نفس اسم الغرفة للتحدث مع أصدقائك</p>
        
        <form onSubmit={handleJoin} className="space-y-4">
          <input 
            type="text" 
            placeholder="اسمك المستعار" 
            className="w-full p-4 bg-black rounded-xl border border-gray-700 outline-none focus:border-[#00a884] transition"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="رقم أو اسم الغرفة السري" 
            className="w-full p-4 bg-black rounded-xl border border-gray-700 outline-none focus:border-[#00a884] transition"
            onChange={(e) => setRoom(e.target.value)}
            required
          />
          <button className="w-full bg-[#00a884] text-black font-bold py-4 rounded-xl hover:bg-[#008f6f] transition-all transform hover:scale-[1.02]">
            دخول الآن
          </button>
        </form>
      </div>
    </div>
  );
}