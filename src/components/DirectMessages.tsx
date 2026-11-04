import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Image as ImageIcon, 
  Heart, 
  Phone, 
  Video, 
  Info, 
  Search, 
  Edit,
  Send,
  MessageSquare
} from 'lucide-react';
import { ChatThread, Message, User } from '../types';

interface DirectMessagesProps {
  currentUser: User;
  chats?: ChatThread[];
  colleagues?: User[];
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({ 
  currentUser, 
  chats: chatsProp,
  colleagues = [] 
}) => {
  // Generate chat threads from real registered colleagues
  const buildInitialThreads = (): ChatThread[] => {
    const list: ChatThread[] = [];
    
    // Add existing passed chats
    if (chatsProp && chatsProp.length > 0) {
      list.push(...chatsProp);
    }

    // Add threads for each real colleague if not already present
    colleagues
      .filter((u) => u.id !== currentUser.id)
      .forEach((colleague) => {
        const existing = list.find((c) => c.user.id === colleague.id);
        if (!existing) {
          list.push({
            id: 'ch_' + colleague.id,
            companyId: colleague.companyId,
            user: colleague,
            lastMessage: `Start collaborating with @${colleague.username}`,
            timestamp: 'Now',
            unread: false,
            messages: [
              {
                id: 'm_init_' + colleague.id,
                senderId: colleague.id,
                text: `Hi ${currentUser.fullName}! 👋 Connected with you on ${colleague.department} workspace channel.`,
                timestamp: 'Active',
                isMine: false,
              },
            ],
          });
        }
      });

    return list;
  };

  const [chats, setChats] = useState<ChatThread[]>(buildInitialThreads);
  const [activeChatId, setActiveChatId] = useState<string>(() => chats[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updated = buildInitialThreads();
    setChats(updated);
    if (!updated.find(c => c.id === activeChatId) && updated.length > 0) {
      setActiveChatId(updated[0].id);
    }
  }, [colleagues, chatsProp]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMsg: Message = {
      id: 'm_' + Date.now(),
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    if (!activeChat) return;
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
    <div className="w-full max-w-5xl mx-auto h-[82vh] bg-white border border-rose-100 rounded-3xl overflow-hidden flex shadow-md my-2">
      {/* Left Chat List Column */}
      <div className="w-full sm:w-72 md:w-80 border-r border-rose-100 flex flex-col h-full bg-white flex-shrink-0">
        {/* User DM Header */}
        <div className="p-3.5 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
          <div className="flex items-center gap-2 min-w-0">
            <span 
              className="font-bold text-sm text-neutral-900 truncate"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {currentUser.username}
            </span>
            <span className="text-xs text-rose-500 font-bold">●</span>
          </div>
          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Direct Comms
          </span>
        </div>

        {/* Search */}
        <div className="p-2.5 border-b border-rose-50">
          <div className="flex items-center gap-2 bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-1.5">
            <Search size={14} className="text-rose-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search colleagues..."
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
            Registered Colleagues ({filteredChats.length})
          </div>

          {filteredChats.length === 0 ? (
            <div className="p-6 text-center text-xs text-neutral-400">
              No colleagues found. Registered members will show up here!
            </div>
          ) : (
            filteredChats.map((chat) => {
              const isSelected = chat.id === activeChatId;

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition ${
                    isSelected ? 'bg-rose-50/80 border-l-4 border-rose-600' : 'hover:bg-rose-50/30'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.user.avatar}
                      alt={chat.user.username}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-rose-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

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
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Message Thread */}
      {activeChat ? (
        <div className="hidden sm:flex flex-1 flex-col h-full bg-white min-w-0">
          {/* Thread Header */}
          <div className="px-5 py-3 border-b border-rose-100 flex items-center justify-between bg-white shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activeChat.user.avatar}
                alt={activeChat.user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-300 flex-shrink-0"
              />
              <div className="min-w-0">
                <div 
                  className="font-bold text-xs text-neutral-900 truncate"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {activeChat.user.fullName}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>@{activeChat.user.username} • {activeChat.user.department}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-rose-500">
              <Phone size={18} className="cursor-pointer hover:text-rose-700" />
              <Video size={18} className="cursor-pointer hover:text-rose-700" />
              <Info size={18} className="cursor-pointer hover:text-rose-700" />
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-rose-50/20 to-white">
            <div className="flex flex-col items-center py-6 text-center">
              <img
                src={activeChat.user.avatar}
                alt={activeChat.user.username}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-200 mb-2 shadow-sm"
              />
              <span 
                className="font-bold text-sm text-neutral-900"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {activeChat.user.fullName}
              </span>
              <span className="text-xs text-rose-600 font-semibold">
                @{activeChat.user.username} • {activeChat.user.designation}
              </span>
            </div>

            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                    msg.isMine
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-br-none'
                      : 'bg-rose-50 text-neutral-800 rounded-bl-none border border-rose-100'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.isMine ? 'text-rose-100' : 'text-neutral-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-rose-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder={`Message @${activeChat.user.username}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-rose-50/40 border border-rose-200 rounded-2xl px-4 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="button"
              onClick={handleSendHeart}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
            >
              <Heart size={18} />
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold text-xs shadow-xs transition disabled:opacity-40 flex items-center gap-1"
            >
              <Send size={13} />
              <span>Send</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden sm:flex flex-col items-center justify-center p-8 text-center text-neutral-400">
          <MessageSquare size={36} className="text-rose-300 mb-2" />
          <p className="text-xs">Select a colleague to start direct communications</p>
        </div>
      )}
    </div>
  );
};
