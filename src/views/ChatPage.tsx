import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MessageSquare, Search, Send, ArrowLeft, User, Tag, Shield, Ban, CheckCheck } from 'lucide-react';

interface ChatConversation {
  productId: string;
  productTitle: string;
  productImage: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
  }>;
}

export const ChatPage: React.FC = () => {
  const { currentUser, chats, listings, sendChatMessage } = useApp();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group chats by product and other user to create conversations
  const conversations: ChatConversation[] = React.useMemo(() => {
    if (!currentUser) return [];

    const conversationMap = new Map<string, ChatConversation>();

    chats.forEach((msg) => {
      // Only include conversations involving current user
      if (msg.senderId !== currentUser.id && msg.recipientId !== currentUser.id) return;

      const otherUserId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
      const otherUserName = msg.senderId === currentUser.id ? '' : msg.senderName;
      const key = `${msg.productId}-${otherUserId}`;

      if (!conversationMap.has(key)) {
        const product = listings.find((l) => l.id === msg.productId);
        conversationMap.set(key, {
          productId: msg.productId,
          productTitle: msg.productTitle,
          productImage: product?.imageUrl || '',
          otherUserId,
          otherUserName: otherUserName || 'Seller',
          lastMessage: msg.text,
          lastMessageTime: msg.timestamp,
          messages: [],
        });
      }

      const conv = conversationMap.get(key)!;
      conv.messages.push({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        text: msg.text,
        timestamp: msg.timestamp,
      });
      conv.lastMessage = msg.text;
      conv.lastMessageTime = msg.timestamp;
    });

    return Array.from(conversationMap.values()).sort(
      (a, b) => b.messages.length - a.messages.length
    );
  }, [chats, currentUser, listings]);

  const selectedConv = conversations.find((c) => c.productId === selectedConversation);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !currentUser) return;

    try {
      await sendChatMessage(
        selectedConv.otherUserId,
        selectedConv.productId,
        selectedConv.productTitle,
        newMessage
      );
      setNewMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto border border-slate-200">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Active Session</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please log in to view your conversations and chat with sellers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="chat-view">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="flex h-full">
          
          {/* Sidebar: Chat List */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {conversations.length} active
                </span>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 font-medium">No conversations yet</p>
                  <p className="text-xs text-slate-400 mt-1">Send a message to a seller to start chatting</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={`${conv.productId}-${conv.otherUserId}`}
                    onClick={() => setSelectedConversation(conv.productId)}
                    className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${
                      selectedConversation === conv.productId ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        {conv.productImage ? (
                          <img src={conv.productImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-5 h-5 text-slate-300" />
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{conv.otherUserName}</h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{conv.productTitle}</p>
                        <p className="text-xs text-slate-400 truncate mt-1">{conv.lastMessage}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Main: Chat Window */}
          <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
            {!selectedConv ? (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Your Messages</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Select a conversation from the sidebar to start chatting with buyers and sellers.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-white flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>

                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {selectedConv.productImage ? (
                      <img src={selectedConv.productImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{selectedConv.otherUserName}</h3>
                    <Link 
                      to={`/product/${selectedConv.productId}`}
                      className="text-xs text-emerald-600 hover:text-emerald-700 truncate block"
                    >
                      Re: {selectedConv.productTitle}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-rose-600"
                      title="Block user"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {selectedConv.messages.map((msg) => {
                    const isMine = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMine
                              ? 'bg-emerald-600 text-white rounded-br-md'
                              : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-emerald-100' : 'text-slate-400'}`}>
                            <span className="text-[10px]">{msg.timestamp}</span>
                            {isMine && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};