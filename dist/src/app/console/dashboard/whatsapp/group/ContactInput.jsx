"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactInput = ContactInput;
const input_1 = require("@/components/ui/input");
const button_1 = require("@/components/ui/button");
function ContactInput({ contact, onChange, onRemove }) {
    return (<div className="flex gap-2">
            <input_1.Input type="text" value={contact.name} onChange={(e) => onChange('name', e.target.value)} // Pass field and value
     placeholder="Name" className="bg-white text-black" // Removed border color
    />
            <input_1.Input type="text" value={contact.phone} onChange={(e) => onChange('phone', e.target.value)} // Pass field and value
     placeholder="Phone" className="bg-white text-black" // Removed border color
    />
            <button_1.Button type="button" onClick={onRemove} // No index required here
     variant="outline" className="text-[#41b658] hover:bg-[#41b658] hover:text-white" // Removed border color
    >
                Remove
            </button_1.Button>
        </div>);
}
