'use client';
import React, { useState, useEffect, useRef } from 'react';

interface Message {
  _id?: string;
  senderEmail: string;
  content: string;
  timestamp: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load current user email from localStorage
  useEffect(() => {
    const email = localStorage.getItem('email') || '';
    setCurrentUserEmail(email);
  }, []);

  // Function to fetch messages
  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:3000/messages');
      const data = await res.json();
      setMessages(data.reverse());
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Polling: fetch messages every 3 seconds
  useEffect(() => {
    fetchMessages(); // initial fetch
    const interval = setInterval(fetchMessages, 3000); // fetch every 3 sec
    return () => clearInterval(interval);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserEmail) return;

    setIsSending(true);
    try {
      const res = await fetch('http://localhost:3000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail: currentUserEmail,
          content: newMessage,
          timestamp: new Date(),
        }),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => [...prev, savedMsg]);
        setNewMessage('');
        scrollToBottom();
      } else {
        console.error('Failed to send message:', await res.text());
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#ECE5DD]">
      {/* Header */}
      <div className="bg-[#075E54] text-white p-4 shadow-md">
        <h2 className="text-xl font-bold">Community Chat</h2>
        <p className="text-sm text-gray-200">Agrolink Community</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No messages yet...</p>
        )}

        {messages.map((msg) => {
          const isUser = msg.senderEmail === currentUserEmail;
          return (
            <div
              key={msg._id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  isUser
                    ? 'bg-[#DCF8C6] text-right rounded-br-none'
                    : 'bg-white text-left rounded-bl-none'
                }`}
              >
                {!isUser && (
                  <p className="text-sm font-semibold text-[#075E54] mb-1">
                    {msg.senderEmail}
                  </p>
                )}
                <p className="text-gray-800 break-words">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} /> {/* Scroll anchor */}
      </div>

      {/* Message Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-4 bg-[#F0F0F0] border-t border-gray-300"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-full border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E54]"
        />
        <button
          type="submit"
          disabled={isSending || !currentUserEmail}
          className={`px-4 py-2 rounded-full text-white ${
            isSending || !currentUserEmail
              ? 'bg-gray-400'
              : 'bg-[#075E54] hover:bg-[#128C7E]'
          }`}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
