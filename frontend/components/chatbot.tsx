"use client";
import React, { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false); // New state for Voice Call
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Welcome to HNM Food Groups. How may I assist you today?' }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // --- TEXT CHAT LOGIC ---
  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    
    const userMsg = { role: 'user', text: trimmedInput };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "Connection error. Please try again." }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage();
    }
  };

  // --- VOICE CALL LOGIC ---
  const startVoiceCall = async () => {
    setIsCalling(true);
    // This uses the Vapi Web SDK logic
    // For a real production call, you would import @vapi-ai/web
    alert("Connecting to HNM Luxury Voice Line... 📞");
    
    // Mocking the call interface for now. 
    // In production, you'd initialize the Vapi client here.
    setTimeout(() => {
      alert("Voice call connected! You can now speak with our agent.");
      // In a real setup, the Vapi SDK takes over the audio here.
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ scale: 0, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0, opacity: 0, y: 20 }}
            className="glass-card w-96 h-[500px] rounded-3xl mb-4 flex flex-col overflow-hidden shadow-2xl border border-white/20"
          >
            {/* Header with Call Toggle */}
            <div className="bg-[#4A1F0A] p-4 flex justify-between items-center text-[#E8D7A5] font-bold serif-heading">
              <span>HNM Digital Concierge</span>
              <button 
                onClick={startVoiceCall}
                className="bg-[#E8D7A5] text-black p-2 rounded-full hover:bg-white transition-all flex items-center gap-2 text-xs"
              >
                <span>📞</span> Call Agent
              </button>
            </div>
            
            {/* Call Overlay (Visible when isCalling is true) */}
            {isCalling && (
              <div className="absolute inset-0 z-30 bg-[#2B1108]/95 flex flex-col items-center justify-center text-center p-6">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 bg-[#E8D7A5] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_#E8D7A5]"
                >
                  📞
                </motion.div>
                <h2 className="text-2xl serif-heading text-[#E8D7A5] mb-2">Connecting to Concierge...</h2>
                <p className="text-gray-300 mb-8">Please stay on the line</p>
                <button 
                  onClick={() => setIsCalling(false)}
                  className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700 transition"
                >
                  End Call
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/5">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                  m.role === 'user' 
                    ? 'bg-[#E8D7A5] text-black ml-auto rounded-tr-none' 
                    : 'bg-white/10 text-white mr-auto rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 flex gap-2 border-t border-white/10 bg-[#2B1108]">
              <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                className="flex-1 bg-white/10 border border-white/20 p-2 rounded-lg outline-none text-white placeholder-gray-400 text-sm" 
                placeholder="Ask us..." 
              />
              <button onClick={sendMessage} className="bg-[#E8D7A5] text-black px-4 py-2 rounded-lg font-bold text-sm">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 bg-[#E8D7A5] rounded-full shadow-xl text-2xl hover:scale-110 transition-transform">
        💬
      </button>
    </div>
  );
}