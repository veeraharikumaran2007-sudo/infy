import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Image as ImageIcon, 
  Heart, 
  Phone, 
  Video, 
  Info, 
  Search, 
  Edit 
} from 'lucide-react';
import { INITIAL_CHATS } from '../mockData';
import { ChatThread, Message, User } from '../types';

interface DirectMessagesProps {
  currentUser: User;
  chats?: ChatThread[];
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({ currentUser, chats: chatsProp }) => {
  const [chats, setChats] = useState<ChatThread[]>(chatsProp || INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id || 'ch_2');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (chatsProp && chatsProp.length > 0) {
      setChats(chatsProp);
      if (!chats.find(c => c.id === activeChatId)) {
        setActiveChatId(chatsProp[0].id);
      }
    }
  }, [chatsProp]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: 'Just now',
      isMine: true,
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            lastMessage: inputText.trim(),
            timestamp: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText('');
  };

  const handleSendHeart = () => {
    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: '❤️',
      timestamp: 'Just now',
      isMine: true,
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: '❤️', timestamp: 'Just now', messages: [...c.messages, newMsg] }
          : c
      )
    );
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto h-[82vh] bg-white border border-rose-100 rounded-3xl overflow-hidden flex shadow-md my-3">
      {/* Left Chat List Column */}
      <div className="w-full md:w-80 border-r border-rose-100 flex flex-col h-full bg-white">
        {/* User DM Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-2">
            <span 
              className="font-bold text-sm text-neutral-900"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {currentUser.username}
            </span>
            <span className="text-xs text-rose-500 font-bold">●</span>
          </div>
          <button className="text-rose-500 hover:text-rose-700 p-1">
            <Edit size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-rose-50">
          <div className="flex items-center gap-2 bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-1.5">
            <Search size={15} className="text-rose-400" />
            <input
              type="text"
              placeholder="Search colleague chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-rose-50">
          <div 
            className="px-4 py-2 text-[10px] font-bold text-rose-500 uppercase tracking-wider"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Direct Comms
          </div>
          {filteredChats.map((chat) => {
            const isSelected = chat.id === activeChatId;

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition ${
                  isSelected ? 'bg-rose-50/80 border-l-4 border-rose-600' : 'hover:bg-rose-50/30'
                }`}
              >
                <img
                  src={chat.user.avatar}
                  alt={chat.user.username}
                  className="w-11 h-11 rounded-full object-cover ring-1 ring-rose-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-bold text-xs text-neutral-900 truncate"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      {chat.user.fullName}
                    </span>
                    <span className="text-[10px] text-neutral-400">{chat.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Conversation Window */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-3">
            <img
              src={activeChat.user.avatar}
              alt={activeChat.user.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200"
            />
            <div className="flex flex-col">
              <span 
                className="font-bold text-sm text-neutral-900"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {activeChat.user.fullName}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">Active in workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-rose-500">
            <button className="hover:text-rose-700 p-1">
              <Phone size={18} />
            </button>
            <button className="hover:text-rose-700 p-1">
              <Video size={20} />
            </button>
            <button className="hover:text-rose-700 p-1">
              <Info size={18} />
            </button>
          </div>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <img
              src={activeChat.user.avatar}
              alt={activeChat.user.username}
              className="w-18 h-18 rounded-full object-cover mb-2 ring-2 ring-rose-300 shadow-sm"
            />
            <h3 
              className="font-bold text-sm text-neutral-900"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {activeChat.user.fullName}
            </h3>
            <span className="text-[11px] text-rose-500 font-medium">@{activeChat.user.username} • {activeChat.user.department}</span>
          </div>

          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.isMine
                    ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 text-white rounded-br-xs shadow-xs'
                    : 'bg-rose-50 text-neutral-800 rounded-bl-xs border border-rose-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3.5 border-t border-rose-100 flex items-center gap-3 bg-white">
          <div className="flex-1 flex items-center gap-3 bg-rose-50/50 border border-rose-100 rounded-full px-4 py-2.5">
            <button
              type="button"
              onClick={() => setInputText((prev) => prev + ' 🚀')}
              className="text-rose-400 hover:text-rose-600"
            >
              <Smile size={18} />
            </button>
            <input
              type="text"
              placeholder="Message colleague..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
            />
            <button
              type="button"
              className="text-rose-400 hover:text-rose-600"
            >
              <ImageIcon size={18} />
            </button>
          </div>

          {inputText.trim() ? (
            <button
              type="submit"
              className="text-rose-600 font-bold text-xs hover:text-rose-700 px-2"
            >
              Send
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendHeart}
              className="text-rose-500 hover:scale-110 active:scale-95 transition px-2"
            >
              <Heart size={22} className="fill-rose-500" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
