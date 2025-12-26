
import React from 'react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Simple formatter for business insights (bolding, lists)
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Check for headers
      if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('###', '')}</h3>;
      if (line.startsWith('##')) return <h2 key={i} className="text-xl font-bold mt-6 mb-3 border-b pb-1">{line.replace('##', '')}</h2>;
      if (line.startsWith('#')) return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('#', '')}</h1>;
      
      // Check for bold
      let formattedLine: any = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      if (parts.length > 1) {
        formattedLine = parts.map((part, index) => 
          index % 2 === 1 ? <strong key={index} className="text-slate-900 font-semibold">{part}</strong> : part
        );
      }

      // Check for bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return <li key={i} className="ml-4 list-disc mb-1">{formattedLine}</li>;
      }

      return <p key={i} className="mb-2 leading-relaxed">{formattedLine}</p>;
    });
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] lg:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600 ml-3' : 'bg-white border border-slate-200 mr-3 shadow-sm'}`}>
          {isUser ? (
            <i className="fa-solid fa-user text-white text-sm"></i>
          ) : (
            <i className="fa-solid fa-robot text-blue-600 text-sm"></i>
          )}
        </div>
        
        <div className={`px-5 py-4 rounded-2xl shadow-sm text-sm ${isUser ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
          <div className="prose prose-sm max-w-none">
            {formatContent(message.content)}
          </div>
          <div className={`text-[10px] mt-2 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
