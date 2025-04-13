"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserList = UserList;
const lucide_react_1 = require("lucide-react");
const image_1 = __importDefault(require("next/image"));
function UserList({ users, selectedUserId, onSelectUser }) {
    return (<div className="space-y-2">
      {users.map((user) => (<button key={user.id} onClick={() => onSelectUser(user.id)} className={`w-full p-2 flex items-center space-x-3 rounded-lg transition-colors ${selectedUserId === user.id
                ? 'bg-blue-500 text-white'
                : 'hover:bg-blue-600/5 text-gray-700'}`}>
          <div className="relative flex-shrink-0">
            {user.avatar ? (<image_1.default src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full"/>) : (<lucide_react_1.UserCircle className="w-9 h-9"/>)}
          </div>
          <div className="flex-1 text-left min-w-0"> {/* Add min-w-0 to prevent flex overflow */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium truncate">{user.name}</h3> {/* Truncate name if too long */}
            </div>
            {user.lastMessage && (<p className="text-sm truncate">{user.lastMessage}</p>)}
          </div>
          
        </button>))}
    </div>);
}
