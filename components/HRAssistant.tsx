import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Paperclip,
  RotateCcw,
  ShieldCheck,
  BrainCircuit,
  MessageSquarePlus
} from 'lucide-react';
import { getHRAssistantResponse } from '../services/gemini';
import { Message } from '../types';

const HRAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: "Selamat datang di HUREMA AI. Saya adalah asisten HR profesional Anda. Ada yang bisa saya bantu terkait kebijakan perusahaan, tinjauan kinerja, atau peraturan ketenagakerjaan hari ini?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await getHRAssistantResponse(userMsg, messages);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'model', content: response || "Maaf, saya sedang mengalami kendala teknis. Mohon coba lagi nanti." }]);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary-950 rounded-[1.5rem] text-white shadow-xl shadow-primary-900/30">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-primary-950 tracking-tight">
              HUREMA AI Assistant
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
              <Sparkles size={12} className="text-secondary" /> Intelligent Support • Gemini 3 Flash
            </p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([messages[0]])}
          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all shadow-sm border border-slate-100 bg-white"
          title="Reset Chat"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-950 via-secondary to-primary-950"></div>
        
        <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-[#FDFDFD]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary-950 text-white shadow-primary-900/20' 
                    : 'bg-white border border-slate-100 text-primary-950'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed font-medium ${
                  msg.role === 'user' 
                    ? 'bg-primary-950 text-white shadow-xl shadow-primary-900/20 rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-700 shadow-md rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-primary-950 shadow-md flex items-center justify-center animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 flex gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-primary-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-primary-800 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="flex items-end gap-4 bg-slate-50 border border-slate-200 p-3 rounded-2xl focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-950 transition-all">
            <button className="p-3 text-slate-400 hover:text-primary-950 hover:bg-white rounded-xl transition-all">
              <Paperclip size={24} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Tanyakan apapun tentang HR..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-900 resize-none py-3 max-h-40 min-h-[50px] placeholder:text-slate-400"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all ${
                input.trim() && !isLoading 
                  ? 'bg-primary-950 text-white shadow-xl shadow-primary-900/40 hover:scale-105 active:scale-95' 
                  : 'text-slate-300'
              }`}
            >
              <Send size={24} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-4 text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Secure Corporate AI</span>
              <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-secondary" /> Gemini Integrated</span>
            </div>
            <p className="text-[9px] font-black text-primary-950/20 italic">v1.2 // FLASH 3.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRAssistant;