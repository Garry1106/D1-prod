"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageInput = MessageInput;
const lucide_react_1 = require("lucide-react");
const react_1 = require("react");
function MessageInput({ onSendMessage }) {
    const [message, setMessage] = (0, react_1.useState)('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };
    return (<form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-2">
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <lucide_react_1.Paperclip className="w-5 h-5 text-gray-600"/>
        </button>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <button type="button" className="p-2 hover:bg-gray-100 rounded-full">
          <lucide_react_1.Smile className="w-5 h-5 text-gray-600"/>
        </button>
        <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
          <lucide_react_1.Send className="w-5 h-5"/>
        </button>
      </div>
    </form>);
}
