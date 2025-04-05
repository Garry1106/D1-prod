import { Send, Paperclip, Smile } from 'lucide-react';
import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <Smile className="w-5 h-5 text-gray-600" />
        </button>
        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}