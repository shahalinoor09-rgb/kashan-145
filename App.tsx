
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MessageItem from './components/MessageItem';
import { Message, BusinessProfile, SUGGESTED_PROMPTS } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<BusinessProfile>({
    industry: '',
    companySize: '',
    targetMarket: '',
    businessGoal: ''
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('biz_chat_history');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    
    const savedProfile = localStorage.getItem('biz_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('biz_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('biz_profile', JSON.stringify(profile));
  }, [profile]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      let fullContent = '';
      const stream = geminiService.streamChat(text, profile, messages);
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => 
          prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m)
        );
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => 
        prev.map(m => m.id === assistantId ? { ...m, content: "Sorry, I encountered an error. Please check your connection and try again." } : m)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all chat history?")) {
      setMessages([]);
      geminiService.resetChat();
    }
  };

  const exportInsights = () => {
    const text = messages.map(m => `${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleString()}):\n${m.content}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Business-Insights-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b p-4 flex justify-between items-center z-10">
        <h1 className="text-lg font-bold text-slate-800">BizBrain AI</h1>
        <button onClick={() => alert("Check sidebar on larger screens or scroll down for profile settings.")}>
          <i className="fa-solid fa-bars text-xl"></i>
        </button>
      </header>

      <Sidebar 
        profile={profile} 
        setProfile={setProfile} 
        onClearHistory={clearHistory}
        onExportChat={exportInsights}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm animate-pulse">
                <i className="fa-solid fa-chart-line text-3xl"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to BizBrain</h2>
                <p className="text-slate-500">Your AI business consultant. Complete your profile on the left for more tailored insights, or start with a quick prompt below.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {SUGGESTED_PROMPTS.map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSendMessage(suggestion.prompt)}
                    className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
                  >
                    <span className="block text-sm font-semibold text-slate-800 group-hover:text-blue-600 mb-1">{suggestion.label}</span>
                    <span className="block text-xs text-slate-500 truncate">{suggestion.prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {messages.map(m => (
                <MessageItem key={m.id} message={m} />
              ))}
              {isLoading && messages[messages.length-1].content === '' && (
                <div className="flex justify-start mb-6">
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={1}
              placeholder="Ask me anything about your business strategy..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-14 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-all flex items-center justify-center shadow-lg shadow-blue-200"
            >
              <i className="fa-solid fa-paper-plane text-sm"></i>
            </button>
          </div>
          <div className="max-w-4xl mx-auto mt-2 flex justify-between items-center text-[10px] text-slate-400 px-2">
            <span>Shift + Enter for new line</span>
            <span>Business Consultant Mode Active</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
